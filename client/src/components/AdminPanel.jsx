import BooksPanel from "./BooksPanel";

const AdminPanel = ({ setBookDetails }) => {
  return (
    <div className="adminPanel">
      <BooksPanel setBookDetails={setBookDetails} />
    </div>
  );
};

export default AdminPanel;
