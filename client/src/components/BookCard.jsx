import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="bookCard">
      <img src={book.poster} alt={book.title} />
      <h2>
        {book.title} - {book.publishYear}
      </h2>
      <p>{book.description.substring(0, 100)}...</p>
      <p>Price: ${book.price}</p>
    </div>
  );
};

export default BookCard;
