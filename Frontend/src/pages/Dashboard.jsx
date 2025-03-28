import DashNav from "../components/DashNav";
import ProjectsList from "../components/projects/ProjectsList";
const Dashboard = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        <DashNav />
        <div className="container mx-auto px-4 py-8">
          <ProjectsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
