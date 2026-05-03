import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WorkspaceEditModal from "@protectedRoutes/workspace/components/WorkspaceEditModal";
import DrawerMenu from "@components/DrawerMenu";
import {
  tasksQueryOptions,
  workspaceColumnsQueryOptions,
  workspaceMembersQueryOptions,
  workspaceQueryOptions,
} from "@hooks/queryOptions";
import MemberAddModal from "@protectedRoutes/workspace/components/MemberAddModal";
import WorkspaceColumns from "@protectedRoutes/workspace/components/WorkspaceColumns";
import WorkspaceColumnAddModal from "@protectedRoutes/workspace/components/WorkspaceColumnAddModal";
import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";
import { useState } from "react";
import WorkspaceColumnEditModal from "@protectedRoutes/workspace/components/WorkspaceColumnEditModal";
import WorkspaceTaskAddModal from "@protectedRoutes/workspace/components/WorkspaceTaskAddModal";

const ADD_WORKSPACE_COLUMN_MODAL_ID = "add_workspace_column_dialog";
const EDIT_WORKSPACE_COLUMN_MODAL_ID = "edit_workspace_column_dialog";
const EDIT_WORKSPACE_MODAL_ID = "edit_workspace_dialog";
const ADD_MEMBER_MODAL_ID = "add_member_dialog";
const ADD_TASK_MODAL_ID = "add_task_dialog";

export function ErrorBoundary() {
  return (
    <DrawerMenu>
      <div className="flex-center bg-gradient min-h-[90svh] px-4">
        <section className="shadow-elevation-high mb-[10svh] w-full max-w-md rounded-lg bg-red-500 px-6 py-8 text-center text-white">
          <h1 className="mb-2 text-xl font-bold">
            We couldn't load your workspace
          </h1>
          <p className="text-sm">
            Something went wrong while loading this page. Please try again in a
            moment.
          </p>
        </section>
      </div>
    </DrawerMenu>
  );
}

export function Component() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspace, isFetching: isFetchingWorkspace } = useQuery(
    workspaceQueryOptions(Number(workspaceId!)),
  );
  const { data: workspaceMembers, isFetching: isFetchingWorkspaceMembers } =
    useQuery(workspaceMembersQueryOptions(Number(workspaceId!)));
  const { data: workspaceColumns, isFetching: isFetchingWorkspaceColumns } =
    useQuery(workspaceColumnsQueryOptions(Number(workspaceId!)));
  const { data: tasks, isFetching: isFetchingTasks } = useQuery(
    tasksQueryOptions(Number(workspaceId!)),
  );

  const [selectedWorkspaceColumn, setSelectedWorkspaceColumn] =
    useState<WorkspaceColumnResponse>({} as WorkspaceColumnResponse);

  const openAddWorkspaceColumnModal = () => {
    const modal = document.getElementById(
      ADD_WORKSPACE_COLUMN_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const openEditWorkspaceColumnModal = (
    workspaceColumn: WorkspaceColumnResponse,
  ) => {
    setSelectedWorkspaceColumn(workspaceColumn);
    const modal = document.getElementById(
      EDIT_WORKSPACE_COLUMN_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const openAddTaskModal = (workspaceColumn: WorkspaceColumnResponse) => {
    setSelectedWorkspaceColumn(workspaceColumn);
    const modal = document.getElementById(
      ADD_TASK_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const openEditWorkspaceModal = () => {
    const modal = document.getElementById(
      EDIT_WORKSPACE_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const openAddWorkspaceMembersModal = () => {
    const modal = document.getElementById(
      ADD_MEMBER_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <DrawerMenu
      workspace={workspace}
      workspaceMembers={workspaceMembers}
      isLoading={
        isFetchingWorkspace ||
        isFetchingWorkspaceMembers ||
        isFetchingWorkspaceColumns ||
        isFetchingTasks
      }
      openEditWorkspaceModal={openEditWorkspaceModal}
      openAddWorkspaceMembersModal={openAddWorkspaceMembersModal}
    >
      <div className="bg-gradient min-h-[90svh] overflow-scroll">
        {isFetchingWorkspace ||
        isFetchingWorkspaceMembers ||
        isFetchingWorkspaceColumns ||
        isFetchingTasks ? (
          <div className="mx-auto flex w-[90%] min-w-70 pt-4">
            <div className="skeleton h-64 w-64 shadow-md"></div>
          </div>
        ) : (
          <WorkspaceColumns
            workspaceId={Number(workspaceId!)}
            workspaceColumns={workspaceColumns!}
            tasks={tasks!}
            openAddWorkspaceColumnModal={openAddWorkspaceColumnModal}
            openAddTaskModal={openAddTaskModal}
            openEditWorkspaceColumnModal={openEditWorkspaceColumnModal}
          />
        )}
      </div>
      <WorkspaceColumnAddModal
        workspaceId={workspaceId!}
        workspaceColumnOrder={(workspaceColumns
          ? workspaceColumns.length
          : 0
        ).toString()}
      />
      <WorkspaceColumnEditModal
        workspaceId={workspaceId!}
        workspaceColumn={selectedWorkspaceColumn}
      />
      {tasks && (
        <WorkspaceTaskAddModal
          workspaceId={workspaceId!}
          workspaceColumnId={selectedWorkspaceColumn.id}
          taskOrder={tasks!
            .filter(
              (task) => task.workspaceColumnId === selectedWorkspaceColumn.id,
            )
            .map((task) => {
              return task.taskOrder + 1; // Add 1 so that the returned order from reduce becomes the new last order in the column
            })
            .reduce((prev, current) => (prev > current ? prev : current), 0)}
        />
      )}

      <WorkspaceEditModal workspaceId={workspaceId!} />
      <MemberAddModal workspaceId={workspaceId!} />
    </DrawerMenu>
  );
}
