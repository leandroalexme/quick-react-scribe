
import TextEditor from '@/components/TextEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            React Text Editor
          </h1>
          <p className="text-lg text-gray-600">
            A beautiful and powerful rich text editor built with React
          </p>
        </div>
        <TextEditor />
      </div>
    </div>
  );
};

export default Index;
