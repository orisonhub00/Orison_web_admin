type PageProps = {
  params: {
    id: string;
  };
};

export default function EditStudentPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div>
      <h1>Edit Student</h1>
      <p>Student ID: {id}</p>
    </div>
  );
}
