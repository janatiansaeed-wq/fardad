import StatCard from "./StatCard";

export default function StatsGrid() {

  return (

    <section className="stats-grid">

      <StatCard
        title="کل محصولات"
        value="248"
      />

      <StatCard
        title="سفارش امروز"
        value="16"
      />

      <StatCard
        title="کاربران"
        value="523"
      />

      <StatCard
        title="درآمد امروز"
        value="128,000,000"
      />

    </section>

  );

}