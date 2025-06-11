import React, { useState, useEffect, useCallback } from "react";
import { TableColumn, TableAction, FormField } from "../../types";
import Table from "./Tabble";
import Modal from "./Modal";
import Form from "./Form";
import Button from "./Button";
import Icon from "./Icon";
import { apiService } from "../../Services/ApiServices";
import toast from "react-hot-toast";

export interface EntityManagerConfig<T> {
  entityName: string;
  entityNamePlural: string;
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

  const {
    entityName,
    entityNamePlural,
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
  } = config;

  // Use useCallback to memoize fetchData function to fix useEffect dependency
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.get<T[]>(apiEndpoint);
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(`Error fetching ${entityNamePlural}:`, error);
      toast.error(`Failed to load ${entityNamePlural}`);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, entityNamePlural]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Now fetchData is properly memoized

  const handleCreate = () => {
    setEditingEntity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entity: T) => {
    setEditingEntity(entity);
    setIsModalOpen(true);
  };

  const handleView = (entity: T) => {
    // Implement view logic
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
      await apiService.delete(`${apiEndpoint}/${entity.id}`);
      setData((prev) => prev.filter((item) => item.id !== entity.id));
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

      let processedData = formData;
      if (transformDataForApi) {
        processedData = transformDataForApi(formData);
      }

      if (editingEntity) {
        // Update existing entity
        if (onBeforeUpdate) {
          processedData = onBeforeUpdate(processedData, editingEntity);
        }

        const result = await apiService.put<T>(
          `${apiEndpoint}/${editingEntity.id}`,
          processedData
        );
        setData((prev) =>
          prev.map((item) => (item.id === editingEntity.id ? result : item))
        );
        toast.success(`${entityName} updated successfully`);

        if (onAfterUpdate) {
          onAfterUpdate(processedData, result);
        }
      } else {
        // Create new entity
        if (onBeforeCreate) {
          processedData = onBeforeCreate(processedData);
        }

        const result = await apiService.post<T>(apiEndpoint, processedData);
        setData((prev) => [...prev, result]);
        toast.success(`${entityName} created successfully`);

        if (onAfterCreate) {
          onAfterCreate(processedData, result);
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error saving ${entityName}:`, error);
      toast.error(`Failed to save ${entityName}`);
    } finally {
      setFormLoading(false);
    }
  };

  const getDefaultFormValues = () => {
    if (!editingEntity) {
      return {};
    }

    if (transformDataForForm) {
      return transformDataForForm(editingEntity);
    }

    return editingEntity;
  };

  // Build table actions
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

  // Filter data based on search term
  const filteredData =
    searchable && searchTerm
      ? data.filter((item) => {
          return columns.some((column) => {
            const value = (item as any)[column.key];
            return (
              value &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
        })
      : data;

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          )}

          {canCreate && (
            <Button onClick={handleCreate} leftIcon="plus">
              Create {entityName}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredData}
        columns={columns}
        actions={tableActions}
        loading={loading}
        emptyMessage={`No ${entityNamePlural.toLowerCase()} found`}
        selectable={selectable}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        sortable={sortable}
      />

      {/* Bulk actions */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-sm text-primary-700 dark:text-primary-300">
            {selectedRows.length}{" "}
            {selectedRows.length === 1 ? entityName : entityNamePlural} selected
          </span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="danger"
              leftIcon="trash"
              onClick={() => {
                // Handle bulk delete
                console.log("Bulk delete:", selectedRows);
              }}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEntity ? editTitle : createTitle}
        size="lg"
      >
        <Form
          fields={formFields}
          onSubmit={handleFormSubmit}
          defaultValues={getDefaultFormValues()}
          loading={formLoading}
          submitLabel={editingEntity ? "Update" : "Create"}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default EntityManager;
