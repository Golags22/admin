import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/Components/home";
import { KanbanAddCardButton } from "@/Components/tasks/kanban/add-card-button";
import { KanbanBoardContainer, KanbanBoard,} from "@/Components/tasks/kanban/board";
import  { ProjectCardMemo } from "@/Components/tasks/kanban/card";
import KanbanColumn from "@/Components/tasks/kanban/column";
import KanbanItem from "@/Components/tasks/kanban/item";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { useList } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React from "react";

const List = () => {
  const { data: stages, isLoading: isLoadingstages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],

    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });
  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],

    queryOptions: {
      enabled: !!stages,
    },
    pagination: {
      mode: "off",
    },

    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });
  const taskStages = React.useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unnasignedStage: [],
        stages: [],
      };
    }

    const unnasignedStage = tasks.data.filter((task) => task.stageId === null);

    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }));

    return {
      unnasignedStage,
      columns: grouped,
    };
  }, [stages, tasks]);

  const handleAddCard = (args: { stageId: string }) => {};
  const isLoading = isLoadingstages || isLoadingTasks
  if(isLoading) return PageSkeleton

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard>
          <KanbanColumn
            id="unnasigned"
            title={"unnasigned"}
            count={taskStages.unnasignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unnasigned" })}
          >
            {taskStages.unnasignedStage.map((task) => (
              <KanbanItem
                key={task.id}
                id={task.id}
                data={{ ...task, stageId: "unnasigned" }}
              >
                <ProjectCardMemo
                {...task} dueDate={task.dueDate || undefined} />
              </KanbanItem>
            ))}

          {!taskStages.unnasignedStage.length && (
            <KanbanAddCardButton 
            onClick={()=> handleAddCard({ stageId: 'unnasigned'})}
            />
          )}
          </KanbanColumn>


          {taskStages.columns?.map((column) =>(
            <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            count={column.tasks.length}
            onAddClick={() => handleAddCard({ stageId: column.id})}
            >
{!isLoading && column.tasks.map((task) => (
  <KanbanItem key={task.id} id={task.id} data={task.task}>

    <ProjectCardMemo 
 {...task}
 dueDate={task.dueDate || undefined}
     
     />
  </KanbanItem>
))}

            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  );
};

export default List;

const PageSkeleton = () => {  
const columnCount = 6;
const itemCount = 4;

return (
  <KanbanBoardContainer>
    {Array.from({ length: columnCount}).map((_, index) => (
      <KanbanColumnSkeleton key={index}>
{Array.from({length: itemCount}).map((_, index) => (
   <ProjectCardSkeleton key={index}/>
))}
      </KanbanColumnSkeleton>
    ))}
  </KanbanBoardContainer>
)}