import { BaseEntity } from "./api";

export interface IndexingJob extends BaseEntity {
  jobType: "Full" | "Incremental" | "EntitySpecific";
  status: "Pending" | "Running" | "Completed" | "Failed" | "Cancelled";
  startedAt: string;
  completedAt?: string;
  totalEntities: number;
  processedEntities: number;
  failedEntities: number;
  errorMessage?: string;
  duration?: string;
  progressPercentage: number;
  jobMetadata: Record<string, any>;
}

export interface IndexingJobStatistics {
  totalJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  jobsLast24Hours: number;
  jobsLast7Days: number;
  jobsLast30Days: number;
  lastFullIndex?: string;
  lastIncrementalIndex?: string;
  averageJobDuration?: string;
  jobTypeBreakdown: Record<string, number>;
}
export interface IndexingJobDetail extends IndexingJob {
  jobMetadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
