const BookCard = ({ book }) => {
  return (
    <div className="bookCard">
      <img src={book.poster} alt={book.title} className="bookCardImage" />
      <div className="bookCardContent">
        <h2 className="bookCardTitle">
          {book.title} - {book.publishYear}
        </h2>
        <p className="bookCardDescription">
          {book.description.length > 100
            ? `${book.description.substring(0, 100)}...`
            : book.description}
        </p>
        <p className="bookCardPrice">Price: BHD{book.price}</p>
      </div>
    </div>
  );
};

export default BookCard;
