// src/components/entities/EntityManager.tsx
import React, { useState, useEffect, useCallback } from "react";
import { TableColumn, TableAction, FormField } from "../../types/entities";
import { PagedResult } from "../../types/api";
import Table from "../common/Table";
import Modal from "../common/Modal";
import Form from "../common/Form";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { apiService } from "../../Services/ApiServices";
import toast from "react-hot-toast";

export interface EntityManagerConfig<T> {
  entityName: string;
  apiEndpoint: string;
  columns: TableColumn<T>[];
  formFields: FormField[];
  createTitle?: string;
  editTitle?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  customActions?: TableAction<T>[];
  onBeforeCreate?: (data: any) => any;
  onAfterCreate?: (data: any, result: T) => void;
  onBeforeUpdate?: (data: any, entity: T) => any;
  onAfterUpdate?: (data: any, result: T) => void;
  onBeforeDelete?: (entity: T) => boolean;
  onAfterDelete?: (entity: T) => void;
  transformDataForForm?: (entity: T) => any;
  transformDataForApi?: (data: any) => any;
  customFormRender?: (
    field: FormField,
    value: any,
    onChange: (value: any) => void,
    errors: any,
    formData?: any
  ) => React.ReactNode | null;
}

interface EntityManagerProps<T> {
  config: EntityManagerConfig<T>;
}

function EntityManager<T extends { id: number | string }>({
  config,
}: EntityManagerProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<T | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  const {
    entityName,
    apiEndpoint,
    columns,
    formFields,
    createTitle = `Create ${entityName}`,
    editTitle = `Edit ${entityName}`,
    canCreate = true,
    canEdit = true,
    canDelete = true,
    canView = false,
    searchable = true,
    sortable = true,
    selectable = false,
    customActions = [],
    onBeforeCreate,
    onAfterCreate,
    onBeforeUpdate,
    onAfterUpdate,
    onBeforeDelete,
    onAfterDelete,
    transformDataForForm,
    transformDataForApi,
    customFormRender,
  } = config;

  const entityNamePlural = entityName.endsWith("y")
    ? entityName.slice(0, -1) + "ies"
    : entityName.endsWith("s") ||
      entityName.endsWith("sh") ||
      entityName.endsWith("ch") ||
      entityName.endsWith("x") ||
      entityName.endsWith("z")
    ? entityName + "es"
    : entityName + "s";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log(
        `[EntityManager] Fetching data for ${entityName} from endpoint: ${apiEndpoint}`
      );

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const fullEndpoint = `${apiEndpoint}?${params.toString()}`;
      console.log(`[EntityManager] Full API endpoint: ${fullEndpoint}`);

      try {
        // Try to get paginated data first
        const result = await apiService.get<PagedResult<T> | T[]>(fullEndpoint);
        console.log(`[EntityManager] Received result:`, result);

        if (result && typeof result === "object" && "items" in result) {
          // It's a paginated result
          setData(result.items || []);
          setTotalCount(result.totalCount || 0);
        } else if (Array.isArray(result)) {
          // It's a direct array
          setData(result);
          setTotalCount(result.length);
        } else {
          // Single object or unexpected format
          setData(result ? [result] : []);
          setTotalCount(result ? 1 : 0);
        }
      } catch (error: any) {
        console.log(
          `[EntityManager] Paged request failed, trying fallback approaches:`,
          error
        );

        // Try without pagination parameters
        try {
          const fallbackEndpoint = searchTerm
            ? `${apiEndpoint}?search=${encodeURIComponent(searchTerm)}`
            : apiEndpoint;
          const result = await apiService.get<T[] | PagedResult<T> | T>(
            fallbackEndpoint
          );
          console.log(`[EntityManager] Fallback result:`, result);

          if (result && typeof result === "object" && "items" in result) {
            // It's a paginated result
            setData(result.items || []);
            setTotalCount(result.totalCount || 0);
          } else if (Array.isArray(result)) {
            // It's a direct array
            setData(result);
            setTotalCount(result.length);
          } else {
            // Single object or unexpected format
            setData(result ? [result] : []);
            setTotalCount(result ? 1 : 0);
          }
        } catch (finalError) {
          console.error(`[EntityManager] All requests failed:`, finalError);
          setData([]);
          setTotalCount(0);
          toast.error(`Failed to load ${entityNamePlural}`);
        }
      }
    } catch (error) {
      console.error(`[EntityManager] Error in fetchData:`, error);
      setData([]);
      setTotalCount(0);
      toast.error(`Failed to load ${entityNamePlural}`);
    } finally {
      setLoading(false);
    }
  }, [
    apiEndpoint,
    entityName,
    entityNamePlural,
    currentPage,
    pageSize,
    searchTerm,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    console.log(`[EntityManager] Opening create modal for ${entityName}`);
    setEditingEntity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entity: T) => {
    console.log(
      `[EntityManager] Opening edit modal for ${entityName}:`,
      entity
    );
    setEditingEntity(entity);
    setIsModalOpen(true);
  };

  const handleView = (entity: T) => {
    console.log("View entity:", entity);
  };

  const handleDelete = async (entity: T) => {
    if (onBeforeDelete && !onBeforeDelete(entity)) {
      return;
    }

    if (
      !window.confirm(`Are you sure you want to delete this ${entityName}?`)
    ) {
      return;
    }

    try {
      console.log(
        `[EntityManager] Deleting ${entityName} with ID: ${entity.id}`
      );
      await apiService.delete(`${apiEndpoint}/${entity.id}`);
      await fetchData();
      toast.success(`${entityName} deleted successfully`);

      if (onAfterDelete) {
        onAfterDelete(entity);
      }
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      toast.error(`Failed to delete ${entityName}`);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setFormLoading(true);
      console.log(`[EntityManager] Form submission for ${entityName}:`, {
        isEditing: !!editingEntity,
        editingEntityId: editingEntity?.id,
        apiEndpoint,
        formData,
      });

      let processedData = formData;
      if (transformDataForApi) {
        processedData = transformDataForApi(formData);
        console.log(`[EntityManager] Transformed data:`, processedData);
      }

      if (editingEntity) {
        console.log(
          `[EntityManager] Updating ${entityName} with ID: ${editingEntity.id}`
        );

        if (onBeforeUpdate) {
          processedData = onBeforeUpdate(processedData, editingEntity);
          console.log(
            `[EntityManager] Data after onBeforeUpdate:`,
            processedData
          );
        }

        const updateEndpoint = `${apiEndpoint}/${editingEntity.id}`;
        console.log(`[EntityManager] PUT endpoint: ${updateEndpoint}`);

        const result = await apiService.put<T>(updateEndpoint, processedData);
        console.log(`[EntityManager] Update result:`, result);

        await fetchData();
        toast.success(`${entityName} updated successfully`);

        if (onAfterUpdate) {
          onAfterUpdate(processedData, result);
        }
      } else {
        console.log(`[EntityManager] Creating new ${entityName}`);

        if (onBeforeCreate) {
          processedData = onBeforeCreate(processedData);
          console.log(
            `[EntityManager] Data after onBeforeCreate:`,
            processedData
          );
        }

        console.log(`[EntityManager] POST endpoint: ${apiEndpoint}`);
        const result = await apiService.post<T>(apiEndpoint, processedData);
        console.log(`[EntityManager] Create result:`, result);

        await fetchData();
        toast.success(`${entityName} created successfully`);

        if (onAfterCreate) {
          onAfterCreate(processedData, result);
        }
      }

      setIsModalOpen(false);
    } catch (error: any) {
      console.error(`Error saving ${entityName}:`, error);

      // Try to get a more specific error message
      let errorMessage = `Failed to save ${entityName}`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const getDefaultFormValues = () => {
    if (!editingEntity) {
      console.log(
        `[EntityManager] No editing entity, returning empty defaults`
      );
      return {};
    }

    console.log(
      `[EntityManager] Getting form values for editing entity:`,
      editingEntity
    );

    if (transformDataForForm) {
      const transformed = transformDataForForm(editingEntity);
      console.log(`[EntityManager] Transformed form data:`, transformed);
      return transformed;
    }

    console.log(`[EntityManager] Using entity data as-is for form`);
    return editingEntity;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalClose = () => {
    console.log(`[EntityManager] Modal closing, resetting state`);
    setIsModalOpen(false);
    setEditingEntity(null);
  };

  const tableActions: TableAction<T>[] = [
    ...(canView
      ? [
          {
            label: "View",
            icon: "eye" as const,
            variant: "ghost" as const,
            onClick: handleView,
          },
        ]
      : []),
    ...(canEdit
      ? [
          {
            label: "Edit",
            icon: "edit" as const,
            variant: "ghost" as const,
            onClick: handleEdit,
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: "Delete",
            icon: "trash" as const,
            variant: "danger" as const,
            onClick: handleDelete,
          },
        ]
      : []),
    ...customActions,
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {entityNamePlural}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your {entityNamePlural.toLowerCase()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {searchable && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" size="sm" className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${entityNamePlural.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          )}

          {canCreate && (
            <Button type="button" onClick={handleCreate} leftIcon="plus">
              Create {entityName}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table
        data={data}
        columns={columns}
        actions={tableActions}
        loading={loading}
        emptyMessage={`No ${entityNamePlural.toLowerCase()} found`}
        selectable={selectable}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        sortable={sortable}
      />

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
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              leftIcon="chevron-left"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              rightIcon="chevron-right"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-sm text-primary-700 dark:text-primary-300">
            {selectedRows.length}{" "}
            {selectedRows.length === 1 ? entityName : entityNamePlural} selected
          </span>
          <div className="flex space-x-2">
            <Button
              type="button"
              size="sm"
              variant="danger"
              leftIcon="trash"
              onClick={() => {}}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingEntity ? editTitle : createTitle}
        size="xl"
      >
        <Form
          fields={formFields}
          onSubmit={handleFormSubmit}
          defaultValues={getDefaultFormValues()}
          loading={formLoading}
          submitLabel={editingEntity ? "Update" : "Create"}
          onCancel={handleModalClose}
          customFieldRenderer={customFormRender}
        />
      </Modal>
    </div>
  );
}

export default EntityManager;
