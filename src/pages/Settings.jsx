import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Check,
  Database,
  Download,
  FileJson,
  RotateCcw,
  Settings as SettingsIcon,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";

import { useCash } from "../context/CashContext";

const SETTINGS_KEY = "cash-manager-settings";

const defaultSettings = {
  currency: "BDT",
  dateFormat: "DD/MM/YYYY",
};

export default function Settings() {
  const { transactions } = useCash();

  const [settings, setSettings] =
    useState(defaultSettings);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [message, setMessage] = useState("");

  /*
   * Load saved settings.
   */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(SETTINGS_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error,
      );
    }
  }, []);

  /*
   * Save settings whenever they change.
   */
  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings),
    );
  }, [settings]);

  /*
   * Update a setting.
   */
  const updateSetting = (
    key,
    value,
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    showMessage(
      "Settings saved successfully.",
    );
  };

  /*
   * Show temporary success message.
   */
  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  /*
   * Export all application data.
   */
  const handleExport = () => {
    try {
      const data = {
        app: "Cash Manager",
        version: "1.0",
        exportedAt:
          new Date().toISOString(),
        settings,
        transactions,
      };

      const json = JSON.stringify(
        data,
        null,
        2,
      );

      const blob = new Blob(
        [json],
        {
          type: "application/json",
        },
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `cash-manager-backup-${getDateString()}.json`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showMessage(
        "Backup downloaded successfully.",
      );
    } catch (error) {
      console.error(
        "Export failed:",
        error,
      );

      showMessage(
        "Unable to create backup.",
      );
    }
  };

  /*
   * Import application data.
   */
  const handleImport = (
    event,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (
      loadEvent,
    ) => {
      try {
        const imported =
          JSON.parse(
            loadEvent.target.result,
          );

        if (
          !imported ||
          !Array.isArray(
            imported.transactions,
          )
        ) {
          throw new Error(
            "Invalid backup file",
          );
        }

        localStorage.setItem(
          "cash-management-transactions",
          JSON.stringify(
            imported.transactions,
          ),
        );

        if (imported.settings) {
          localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(
              {
                ...defaultSettings,
                ...imported.settings,
              },
            ),
          );
        }

        showMessage(
          "Backup imported successfully. Reloading...",
        );

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error(
          "Import failed:",
          error,
        );

        showMessage(
          "Invalid backup file.",
        );
      }
    };

    reader.readAsText(file);

    // Allow importing the same file again.
    event.target.value = "";
  };

  /*
   * Delete all transactions.
   */
  const handleDeleteAll = () => {
    localStorage.removeItem(
      "cash-management-transactions",
    );

    setShowDeleteConfirm(false);

    showMessage(
      "All transaction data has been deleted.",
    );

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  /*
   * Reset application settings.
   */
  const handleResetSettings = () => {
    setSettings(
      defaultSettings,
    );

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(
        defaultSettings,
      ),
    );

    showMessage(
      "Settings restored to default.",
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your application preferences and
          data.
        </p>
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {message && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
            <Check size={15} />
          </div>

          {message}
        </motion.div>
      )}

      {/* =====================================================
          GENERAL SETTINGS
      ====================================================== */}

      <SettingsSection
        icon={SettingsIcon}
        title="General Settings"
        description="Customize how Cash Manager displays your information."
      >
        {/* Currency */}
        <SettingRow
          title="Currency"
          description="Currency used throughout the application."
        >
          <select
            value={settings.currency}
            onChange={(event) =>
              updateSetting(
                "currency",
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-56"
          >
            <option value="BDT">
              BDT - Bangladeshi Taka
            </option>

            <option value="USD">
              USD - US Dollar
            </option>

            <option value="EUR">
              EUR - Euro
            </option>

            <option value="GBP">
              GBP - British Pound
            </option>

            <option value="INR">
              INR - Indian Rupee
            </option>
          </select>
        </SettingRow>

        {/* Date Format */}
        <SettingRow
          title="Date Format"
          description="Choose how dates should appear."
        >
          <select
            value={settings.dateFormat}
            onChange={(event) =>
              updateSetting(
                "dateFormat",
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-56"
          >
            <option value="DD/MM/YYYY">
              DD/MM/YYYY
            </option>

            <option value="MM/DD/YYYY">
              MM/DD/YYYY
            </option>

            <option value="YYYY-MM-DD">
              YYYY-MM-DD
            </option>
          </select>
        </SettingRow>
      </SettingsSection>

      {/* =====================================================
          DATA INFORMATION
      ====================================================== */}

      <SettingsSection
        icon={Database}
        title="Data Management"
        description="View and manage the data stored in your browser."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DataCard
            title="Transactions"
            value={transactions.length}
            description="Total records"
          />

          <DataCard
            title="Storage"
            value="Local"
            description="Browser storage"
          />

          <DataCard
            title="Backup"
            value="JSON"
            description="Import / Export"
          />
        </div>

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Database
              size={19}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Your data is stored locally
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Your transactions are currently stored
                in your browser using localStorage.
                Export a backup before clearing your
                browser data or moving to another device.
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* =====================================================
          BACKUP & RESTORE
      ====================================================== */}

      <SettingsSection
        icon={FileJson}
        title="Backup & Restore"
        description="Protect your financial data by creating backups."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Export */}
          <ActionCard
            icon={Download}
            title="Export Backup"
            description="Download all transactions and settings as a JSON file."
            buttonText="Export Data"
            onClick={handleExport}
          />

          {/* Import */}
          <ActionCard
            icon={Upload}
            title="Import Backup"
            description="Restore your transactions and settings from a JSON backup."
            buttonText="Import Data"
            onClick={() =>
              document
                .getElementById(
                  "backup-file-input",
                )
                ?.click()
            }
          />

          <input
            id="backup-file-input"
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          DANGER ZONE
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50/50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2 className="font-bold text-red-900">
                Danger Zone
              </h2>

              <p className="mt-1 text-xs text-red-600">
                These actions cannot be easily undone.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* Reset settings */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Reset Settings
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Restore currency and date format to
                their default values.
              </p>
            </div>

            <button
              onClick={
                handleResetSettings
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={15} />
              Reset Settings
            </button>
          </div>

          {/* Delete data */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-red-100 bg-red-50/30 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-red-800">
                Delete All Transactions
              </p>

              <p className="mt-1 text-xs text-red-500">
                Permanently remove all transaction records
                from this browser.
              </p>
            </div>

            <button
              onClick={() =>
                setShowDeleteConfirm(
                  true,
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              <Trash2 size={15} />
              Delete All Data
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          APP INFORMATION
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Wallet size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              Cash Manager
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Cash Management System · Version 1.0
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {showDeleteConfirm && (
        <DeleteConfirmation
          onCancel={() =>
            setShowDeleteConfirm(false)
          }
          onConfirm={handleDeleteAll}
        />
      )}
    </div>
  );
}

/* =========================================================
   SETTINGS SECTION
========================================================= */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon size={19} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   SETTING ROW
========================================================= */

function SettingRow({
  title,
  description,
  children,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>

      <div className="sm:shrink-0">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   DATA CARD
========================================================= */

function DataCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   ACTION CARD
========================================================= */

function ActionCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={18} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        <Icon size={15} />
        {buttonText}
      </button>
    </div>
  );
}

/* =========================================================
   DELETE CONFIRMATION
========================================================= */

function DeleteConfirmation({
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <AlertTriangle size={22} />
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900">
          Delete all transactions?
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This will permanently remove all transaction
          data stored in this browser. Make sure you
          export a backup first if you may need the data
          later.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete Everything
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================
   DATE STRING
========================================================= */

function getDateString() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}