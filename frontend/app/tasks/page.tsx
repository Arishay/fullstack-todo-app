/**
 * Tasks List Page
 *
 * Server Component for displaying all user's tasks with full CRUD functionality.
 */

import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import TasksClient from '@/components/tasks/TasksClient';

export const metadata = {
  title: 'My Tasks - Todo App',
  description: 'Manage your todo tasks',
};

export default function TasksPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <TasksClient />
      </PageContainer>
    </>
  );
}
