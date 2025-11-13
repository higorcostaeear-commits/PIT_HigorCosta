'use client'
import Link from 'next/link'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import useSWR from 'swr'
import { formatNumber } from '@/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
)
export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
      },
    },
  },
}
const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/admin/orders/summary`)

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Não foi possível carregar o painel: {error.message}</span>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }
  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Sales',
        data: summary.salesData.map(
          (x: { totalSales: number }) => x.totalSales
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: summary.salesData.map(
          (x: { totalOrders: number }) => x.totalOrders
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Category',
        data: summary.productsData.map(
          (x: { totalProducts: number }) => x.totalProducts
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  }
  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Users',
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: summary.usersData.map(
          (x: { totalUsers: number }) => x.totalUsers
        ),
      },
    ],
  }
  return (
    <div>
      <section className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Vendas"
          value={`R$ ${formatNumber(summary.ordersPrice)}`}
          href="/admin/orders"
          linkLabel="Ver vendas"
        />
        <SummaryCard
          title="Pedidos"
          value={formatNumber(summary.ordersCount)}
          href="/admin/orders"
          linkLabel="Ver pedidos"
        />
        <SummaryCard
          title="Produtos"
          value={formatNumber(summary.productsCount)}
          href="/admin/products"
          linkLabel="Ver produtos"
        />
        <SummaryCard
          title="Usuários"
          value={formatNumber(summary.usersCount)}
          href="/admin/users"
          linkLabel="Ver usuários"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Relatório de Vendas">
          <Line data={salesData} options={options} />
        </ChartCard>
        <ChartCard title="Relatório de Pedidos">
          <Line data={ordersData} options={options} />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Produtos por categoria">
          <div className="relative mx-auto h-56 w-full max-w-[18rem] sm:h-64 sm:max-w-[20rem]">
            <Doughnut
              data={productsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </ChartCard>
        <ChartCard title="Crescimento de usuários">
          <Bar data={usersData} options={options} />
        </ChartCard>
      </section>
    </div>
  )
}

const SummaryCard = ({
  title,
  value,
  href,
  linkLabel,
}: {
  title: string
  value: string
  href: string
  linkLabel: string
}) => (
  <article className="group relative overflow-hidden rounded-2xl bg-base-200 p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
    <header>
      <p className="text-sm uppercase tracking-wider text-base-content/70">
        {title}
      </p>
      <h3 className="mt-3 text-3xl font-semibold text-primary">{value}</h3>
    </header>
    <footer className="mt-6">
      <Link href={href} className="link link-hover text-sm font-medium">
        {linkLabel} →
      </Link>
    </footer>
  </article>
)

const ChartCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <article className="overflow-hidden rounded-2xl bg-base-200 p-5 shadow-lg sm:p-6">
    <header className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-base-content sm:text-lg">
        {title}
      </h2>
    </header>
    <div className="relative h-64 rounded-xl bg-base-100 p-3 sm:h-72 sm:p-4">
      {children}
    </div>
  </article>
)
export default Dashboard
