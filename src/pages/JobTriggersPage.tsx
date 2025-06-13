import React, { useState } from "react";
import { apiService } from "../Services/ApiServices";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import Form from "../components/common/Form";
import toast from "react-hot-toast";

interface TriggerJobResponse {
  jobId: string;
  message: string;
  jobType: string;
}

const JobTriggersPage: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isIncrementalModalOpen, setIsIncrementalModalOpen] = useState(false);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);

  const handleTriggerJob = async (jobType: string, data?: any) => {
    try {
      setLoading((prev) => ({ ...prev, [jobType]: true }));

      let endpoint = "";
      let payload = {};

      switch (jobType) {
        case "full":
          endpoint = "/indexingjob/trigger/full";
          break;
        case "incremental":
          endpoint = "/indexingjob/trigger/incremental";
          payload = data || {};
          break;
        case "entity":
          endpoint = "/indexingjob/trigger/entity";
          payload = data;
          break;
        default:
          throw new Error("Unknown job type");
      }

      const result = await apiService.post<TriggerJobResponse>(
        endpoint,
        payload
      );

      toast.success(result.message);

      // Close modals if open
      setIsIncrementalModalOpen(false);
      setIsEntityModalOpen(false);
    } catch (error: any) {
      console.error(`Error triggering ${jobType} job:`, error);
      toast.error(
        error.response?.data?.message || `Failed to trigger ${jobType} job`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [jobType]: false }));
    }
  };

  const incrementalFormFields = [
    {
      name: "since",
      label: "Index Changes Since",
      type: "datetime-local" as const,
      description: "Leave empty to index changes from the last hour",
    },
  ];

  const entityFormFields = [
    {
      name: "entityType",
      label: "Entity Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "page", label: "Page" },
        { value: "file", label: "File" },
        { value: "user", label: "User" },
        { value: "componenttemplate", label: "Component Template" },
      ],
      validation: { required: "Entity type is required" },
    },
    {
      name: "entityId",
      label: "Entity ID",
      type: "number" as const,
      required: true,
      validation: {
        required: "Entity ID is required",
        min: { value: 1, message: "Entity ID must be greater than 0" },
      },
    },
  ];

  const jobCards = [
    {
      title: "Full Reindex",
      description:
        "Reindex all entities in the system. This will clear the existing search index and rebuild it from scratch.",
      icon: "refresh" as const,
      color: "bg-blue-500",
      jobType: "full",
      dangerous: true,
    },
    {
      title: "Incremental Index",
      description:
        "Index only entities that have been modified since a specific time. More efficient for regular updates.",
      icon: "clock" as const,
      color: "bg-green-500",
      jobType: "incremental",
      dangerous: false,
    },
    {
      title: "Entity-Specific Index",
      description:
        "Index a specific entity by type and ID. Useful for immediate updates to individual items.",
      icon: "file" as const,
      color: "bg-purple-500",
      jobType: "entity",
      dangerous: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job Triggers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Trigger indexing jobs to update the search index
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon
              name="exclamation-triangle"
              className="h-5 w-5 text-yellow-400"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                Indexing jobs can impact system performance. Full reindex
                operations should be scheduled during low-traffic periods. Use
                incremental indexing for regular updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobCards.map((card) => (
          <div
            key={card.jobType}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-12 w-12 ${card.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon name={card.icon} size="lg" className="text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>

              <div className="mt-6">
                <Button
                  fullWidth
                  variant={card.dangerous ? "danger" : "primary"}
                  loading={loading[card.jobType]}
                  leftIcon="play"
                  onClick={() => {
                    if (card.jobType === "full") {
                      if (
                        window.confirm(
                          "Are you sure you want to trigger a full reindex? This will clear the existing search index."
                        )
                      ) {
                        handleTriggerJob("full");
                      }
                    } else if (card.jobType === "incremental") {
                      setIsIncrementalModalOpen(true);
                    } else if (card.jobType === "entity") {
                      setIsEntityModalOpen(true);
                    }
                  }}
                >
                  Trigger {card.title}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              leftIcon="refresh"
              loading={loading.quickFull}
              onClick={() => {
                if (window.confirm("Trigger a quick full reindex?")) {
                  handleTriggerJob("full");
                }
              }}
            >
              Quick Full Reindex
            </Button>

            <Button
              variant="outline"
              leftIcon="clock"
              loading={loading.quickIncremental}
              onClick={() =>
                handleTriggerJob("incremental", {
                  since: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                })
              }
            >
              Last Hour Changes
            </Button>

            <Button
              variant="outline"
              leftIcon="calendar"
              loading={loading.quickDaily}
              onClick={() =>
                handleTriggerJob("incremental", {
                  since: new Date(
                    Date.now() - 24 * 60 * 60 * 1000
                  ).toISOString(),
                })
              }
            >
              Last 24 Hours
            </Button>

            <Button
              variant="outline"
              leftIcon="file-text"
              onClick={() => window.open("/jobs", "_blank")}
              rightIcon="external-link-alt"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Incremental Index Modal */}
      <Modal
        isOpen={isIncrementalModalOpen}
        onClose={() => setIsIncrementalModalOpen(false)}
        title="Trigger Incremental Index"
        size="md"
      >
        <Form
          fields={incrementalFormFields}
          onSubmit={(data) => handleTriggerJob("incremental", data)}
          loading={loading.incremental}
          submitLabel="Trigger Incremental Index"
          onCancel={() => setIsIncrementalModalOpen(false)}
        />
      </Modal>

      {/* Entity Index Modal */}
      <Modal
        isOpen={isEntityModalOpen}
        onClose={() => setIsEntityModalOpen(false)}
        title="Trigger Entity-Specific Index"
        size="md"
      >
        <Form
          fields={entityFormFields}
          onSubmit={(data) => handleTriggerJob("entity", data)}
          loading={loading.entity}
          submitLabel="Trigger Entity Index"
          onCancel={() => setIsEntityModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default JobTriggersPage;
