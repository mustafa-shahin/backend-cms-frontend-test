import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../Services/ApiServices";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import Modal from "../components/common/Modal";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  IndexingJobStatistics,
  IndexingJobDetail,
  IndexingJob,
} from "../types";

const JobHistoryPage: React.FC = () => {
  const [jobs, setJobs] = useState<IndexingJob[]>([]);
  const [statistics, setStatistics] = useState<IndexingJobStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<IndexingJobDetail | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    jobType: "",
    startDate: "",
    endDate: "",
  });
  const pageSize = 20;

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const result = await apiService.get<{
        jobs: IndexingJob[];
        totalCount: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>(`/indexingjob?${params.toString()}`);

      setJobs(result.jobs || []);
      setTotalCount(result.totalCount || 0);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load indexing jobs");
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await apiService.get<IndexingJobStatistics>(
        "/indexingjob/statistics"
      );
      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, []);

  const fetchJobDetail = async (jobId: number) => {
    try {
      const jobDetail = await apiService.get<IndexingJobDetail>(
        `/indexingjob/${jobId}`
      );
      setSelectedJob(jobDetail);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching job detail:", error);
      toast.error("Failed to load job details");
    }
  };

  const cancelJob = async (jobId: number) => {
    try {
      await apiService.post(`/indexingjob/${jobId}/cancel`);
      toast.success("Job cancelled successfully");
      fetchJobs(); // Refresh the list
    } catch (error: any) {
      console.error("Error cancelling job:", error);
      toast.error(error.response?.data?.message || "Failed to cancel job");
    }
  };

  const retryJob = async (jobId: number) => {
    try {
      const result = await apiService.post<{
        jobId: string;
        message: string;
        jobType: string;
      }>(`/indexingjob/${jobId}/retry`);
      toast.success(result.message);
      fetchJobs(); // Refresh the list
    } catch (error: any) {
      console.error("Error retrying job:", error);
      toast.error(error.response?.data?.message || "Failed to retry job");
    }
  };

  // Auto-refresh for running jobs
  useEffect(() => {
    fetchJobs();
    fetchStatistics();

    // Set up polling for running jobs
    const interval = setInterval(() => {
      if (
        jobs.some((job) => job.status === "Running" || job.status === "Pending")
      ) {
        fetchJobs();
        fetchStatistics();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchJobs, fetchStatistics]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Running: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Cancelled:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status as keyof typeof statusColors] ||
          statusColors.Pending
        }`}
      >
        {status === "Running" && (
          <Icon name="spinner" size="xs" spin className="mr-1" />
        )}
        {status}
      </span>
    );
  };

  const getProgressBar = (job: IndexingJob) => {
    if (job.status === "Pending") {
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-yellow-600 h-2 rounded-full animate-pulse"
            style={{ width: "10%" }}
          />
        </div>
      );
    }

    if (job.status === "Running") {
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${job.progressPercentage}%` }}
          />
        </div>
      );
    }

    if (job.status === "Completed") {
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full"
            style={{ width: "100%" }}
          />
        </div>
      );
    }

    if (job.status === "Failed") {
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full"
            style={{ width: `${job.progressPercentage}%` }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor indexing job status and history
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon="refresh"
            onClick={() => {
              fetchJobs();
              fetchStatistics();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="briefcase" className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Jobs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {statistics.totalJobs}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="play" className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Running Jobs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {statistics.runningJobs}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon name="check" className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Completed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {statistics.completedJobs}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon
                    name="exclamation-triangle"
                    className="h-6 w-6 text-red-400"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Failed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {statistics.failedJobs}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Type
            </label>
            <select
              value={filters.jobType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, jobType: e.target.value }))
              }
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="Full">Full</option>
              <option value="Incremental">Incremental</option>
              <option value="EntitySpecific">Entity Specific</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <li className="p-6 text-center">
              <Icon
                name="spinner"
                size="lg"
                spin
                className="text-primary-600"
              />
            </li>
          ) : jobs.length === 0 ? (
            <li className="p-6 text-center text-gray-500 dark:text-gray-400">
              No indexing jobs found
            </li>
          ) : (
            jobs.map((job) => (
              <li key={job.id}>
                <div className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon
                          name={
                            job.jobType === "Full"
                              ? "refresh"
                              : job.jobType === "Incremental"
                              ? "clock"
                              : "file"
                          }
                          className="h-6 w-6 text-gray-400"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {job.jobType} Indexing Job #{job.id}
                          </p>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            Started:{" "}
                            {format(
                              new Date(job.startedAt),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </span>
                          {job.completedAt && (
                            <span>
                              Completed:{" "}
                              {format(
                                new Date(job.completedAt),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </span>
                          )}
                          <span>
                            Progress: {job.processedEntities}/
                            {job.totalEntities}
                            {job.totalEntities > 0 &&
                              ` (${job.progressPercentage}%)`}
                          </span>
                        </div>
                        {job.errorMessage && (
                          <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                            Error: {job.errorMessage}
                          </div>
                        )}
                        <div className="mt-2 w-full max-w-xs">
                          {getProgressBar(job)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon="eye"
                        onClick={() => fetchJobDetail(job.id)}
                      >
                        Details
                      </Button>
                      {(job.status === "Running" ||
                        job.status === "Pending") && (
                        <Button
                          size="xs"
                          variant="danger"
                          leftIcon="times"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this job?"
                              )
                            ) {
                              cancelJob(job.id);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      {job.status === "Failed" && (
                        <Button
                          size="xs"
                          variant="secondary"
                          leftIcon="refresh"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to retry this job?"
                              )
                            ) {
                              retryJob(job.id);
                            }
                          }}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <div className="flex items-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              leftIcon="chevron-left"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              rightIcon="chevron-right"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedJob ? `Job #${selectedJob.id} Details` : "Job Details"}
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Type
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedJob.jobType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(selectedJob.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Started At
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {format(
                    new Date(selectedJob.startedAt),
                    "MMM dd, yyyy HH:mm:ss"
                  )}
                </p>
              </div>
              {selectedJob.completedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Completed At
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {format(
                      new Date(selectedJob.completedAt),
                      "MMM dd, yyyy HH:mm:ss"
                    )}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Entities
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedJob.totalEntities}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Processed Entities
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedJob.processedEntities}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Failed Entities
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedJob.failedEntities}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedJob.progressPercentage}%
                </p>
              </div>
            </div>

            {selectedJob.errorMessage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Error Message
                </label>
                <div className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {selectedJob.errorMessage}
                  </p>
                </div>
              </div>
            )}

            {Object.keys(selectedJob.jobMetadata).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Metadata
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <pre className="text-sm text-gray-900 dark:text-white">
                    {JSON.stringify(selectedJob.jobMetadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobHistoryPage;
