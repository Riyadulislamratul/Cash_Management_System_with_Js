import { motion } from "framer-motion";

export default function SummaryCard({
  title,
  amount,
  icon: Icon,
  description,
  type = "default",
}) {
  const styles = {
    default: {
      icon: "bg-slate-100 text-slate-700",
      amount: "text-slate-900",
    },

    income: {
      icon: "bg-emerald-50 text-emerald-600",
      amount: "text-emerald-600",
    },

    expense: {
      icon: "bg-red-50 text-red-600",
      amount: "text-red-600",
    },

    transactions: {
      icon: "bg-violet-50 text-violet-600",
      amount: "text-violet-600",
    },
  };

  const style = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={21} />
        </div>

        <span className="text-xs text-slate-400">
          {description}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <h3
        className={`mt-1 text-2xl font-bold ${style.amount}`}
      >
        {amount}
      </h3>
    </motion.div>
  );
}