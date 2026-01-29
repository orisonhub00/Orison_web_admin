import withAuth from "@/utils/withAuth";

function StudentsPage() {
  return <div className="p-6">Students Page</div>;
}

export default withAuth(StudentsPage);
