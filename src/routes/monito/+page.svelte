<!-- src/routes/monito/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { resolve } from '$app/paths';

  interface QueryMetric {
    time: string;
    query_name: string;
    duration_ms: number;
    row_count: number;
  }

  let chart: Chart;
  let metrics = $state<QueryMetric[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Seuils configurables
  let ALERT_HIGH = $state(1000); // 1 seconde
  let ALERT_LOW = $state(100);   // 100ms

  onMount(async () => {
    await loadMetrics();
  });

  async function loadMetrics() {
    try {
      loading = true;
      const response = await fetch(resolve('/api/metrics'));
      if (!response.ok) throw new Error('Erreur de chargement');
      metrics = await response.json();
      renderChart();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  function renderChart() {
    if (chart) chart.destroy();

    const ctx = document.getElementById('metricsChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Grouper les données par requête et par intervalle de temps
    const queryGroups = groupMetricsByQuery(metrics);

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          // Lignes pour chaque requête
          ...Object.entries(queryGroups).map(([queryName, data], index) => ({
            label: queryName,
            data: data.map(d => ({ x: d.time, y: d.avg_duration })),
            borderColor: getColor(index),
            backgroundColor: getColor(index) + '20',
            tension: 0.4,
            pointRadius: 3
          })),
          // Ligne d'alerte haute
          {
            label: 'Seuil Critique',
            data: metrics.map(m => ({ x: m.time, y: ALERT_HIGH })),
            borderColor: '#ff4444',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          },
          // Ligne d'alerte basse
          {
            label: 'Seuil Warning',
            data: metrics.map(m => ({ x: m.time, y: ALERT_LOW })),
            borderColor: '#ffaa00',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              }
            },
            title: {
              display: true,
              text: 'Heure'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Durée (ms)'
            },
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}ms`;
              }
            }
          },
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  function groupMetricsByQuery(metrics: QueryMetric[]) {
    const groups: { [key: string]: { time: Date; avg_duration: number }[] } = {};
    
    metrics.forEach(metric => {
      if (!groups[metric.query_name]) {
        groups[metric.query_name] = [];
      }
      groups[metric.query_name].push({
        time: new Date(metric.time),
        avg_duration: metric.duration_ms
      });
    });
    
    return groups;
  }

  function getColor(index: number): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];
    return colors[index % colors.length];
  }

  // Statistiques résumées
  const currentStats = $derived({
    totalQueries: metrics.length,
    avgDuration: metrics.length ? 
      Math.round(metrics.reduce((sum, m) => sum + m.duration_ms, 0) / metrics.length) : 0,
    maxDuration: metrics.length ? Math.max(...metrics.map(m => m.duration_ms)) : 0,
    criticalAlerts: metrics.filter(m => m.duration_ms > ALERT_HIGH).length,
    warningAlerts: metrics.filter(m => m.duration_ms > ALERT_LOW && m.duration_ms <= ALERT_HIGH).length
  });
</script>

<svelte:head>
  <title>Monitoring des Requêtes</title>
</svelte:head>

<div class="container">
  <h1>📊 Monitoring des Requêtes PostgreSQL</h1>

  <!-- Statistiques rapides -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">{currentStats.totalQueries}</div>
      <div class="stat-label">Requêtes totales</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{currentStats.avgDuration}ms</div>
      <div class="stat-label">Durée moyenne</div>
    </div>
    <div class="stat-card warning">
      <div class="stat-value">{currentStats.warningAlerts}</div>
      <div class="stat-label">Warnings</div>
    </div>
    <div class="stat-card critical">
      <div class="stat-value">{currentStats.criticalAlerts}</div>
      <div class="stat-label">Critiques</div>
    </div>
  </div>

  <!-- Contrôles -->
  <div class="controls">
    <button onclick={loadMetrics} disabled={loading}>
      {loading ? 'Chargement...' : '🔄 Actualiser'}
    </button>
    <label>
      Seuil Warning (ms): 
      <input type="number" bind:value={ALERT_LOW} />
    </label>
    <label>
      Seuil Critique (ms): 
      <input type="number" bind:value={ALERT_HIGH} />
    </label>
  </div>

  <!-- Graphique -->
  {#if error}
    <div class="error">Erreur: {error}</div>
  {:else}
    <div class="chart-container">
      <canvas id="metricsChart"></canvas>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 20px 0;
  }

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
    border-left: 4px solid #3b82f6;
  }

  .stat-card.warning {
    border-left-color: #f59e0b;
  }

  .stat-card.critical {
    border-left-color: #ef4444;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .stat-label {
    color: #6b7280;
    font-size: 14px;
  }

  .controls {
    display: flex;
    gap: 16px;
    align-items: center;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  .controls button {
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .controls button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .controls label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .controls input {
    padding: 4px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    width: 80px;
  }

  .chart-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: 20px;
  }

  .error {
    background: #fee2e2;
    color: #dc2626;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
  }
</style>