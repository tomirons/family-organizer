import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TasksContextType {
    showCompletedTasks: boolean;
    toggleShowCompletedTasks: () => void;
    setShowCompletedTasks: (show: boolean) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
    children: ReactNode;
}

export function TasksProvider({ children }: TasksProviderProps) {
    const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(true);

    const toggleShowCompletedTasks = () => {
        setShowCompletedTasks(prev => !prev);
    };

    const value: TasksContextType = {
        showCompletedTasks,
        toggleShowCompletedTasks,
        setShowCompletedTasks
    };

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasksContext() {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasksContext must be used within a TasksProvider');
    }
    return context;
}
