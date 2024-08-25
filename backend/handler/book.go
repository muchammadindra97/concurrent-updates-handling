package handler

import (
	"encoding/json"
	"fmt"
	"library-sample-be/database"
	"net/http"
)

type bookModel struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Rev         int    `json:"rev"`
}

type bookRequestPayload struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
}

func BookCreate(w http.ResponseWriter, r *http.Request) {
	payload := bookRequestPayload{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		UtilSendResponseErrorInternal(w, err)
	}

	db := database.GetDb()

	row := db.QueryRow(fmt.Sprintf("INSERT INTO books(title, description, author, rev) VALUES('%s', '%s', '%s', 1) RETURNING id, title, description, author, rev", payload.Title, payload.Description, payload.Author))
	book := bookModel{}

	err := row.Scan(
		&book.Id,
		&book.Title,
		&book.Description,
		&book.Author,
		&book.Rev,
	)

	if err != nil {
		UtilSendResponseErrorInternal(w, err)
		return
	}

	etag, err := UtilHashString(fmt.Sprintf("books;%d;%d", book.Id, book.Rev))
	if err != nil {
		UtilSendResponseErrorInternal(w, err)
		return
	}

	w.Header().Set("ETag", etag)
	UtilSendResponse(w, http.StatusCreated, UtilResponseData{
		UtilBaseResponse: UtilBaseResponse{
			Status:  true,
			Message: "Book created",
		},
		Data: &book,
	})
}

func BookGetById(w http.ResponseWriter, r *http.Request) {
	bookId := r.PathValue("id")

	db := database.GetDb()

	row := db.QueryRow(fmt.Sprintf("SELECT * FROM books WHERE id = %s", bookId))
	book := bookModel{}

	err := row.Scan(
		&book.Id,
		&book.Title,
		&book.Description,
		&book.Author,
		&book.Rev,
	)

	if err != nil {
		UtilSendResponseErrorNotFound(w)
		return
	}

	etag, err := UtilHashString(fmt.Sprintf("books;%d;%d", book.Id, book.Rev))
	if err != nil {
		UtilSendResponseErrorInternal(w, err)
	}

	w.Header().Set("Etag", etag)
	UtilSendResponse(w, http.StatusOK, UtilResponseData{
		UtilBaseResponse: UtilBaseResponse{
			Status:  true,
			Message: "Success",
		},
		Data: &book,
	})
}

func BookUpdateById(w http.ResponseWriter, r *http.Request) {
	etagHeader := r.Header.Get("If-Match")
	if len(etagHeader) == 0 {
		UtilSendResponseClientPreconditionRequired(w)
		return
	}

	bookId := r.PathValue("id")

	db := database.GetDb()

	row := db.QueryRow(fmt.Sprintf("SELECT * FROM books WHERE id = %s", bookId))
	book := bookModel{}

	err := row.Scan(
		&book.Id,
		&book.Title,
		&book.Description,
		&book.Author,
		&book.Rev,
	)

	if err != nil {
		UtilSendResponseErrorNotFound(w)
		return
	}

	isEtagMatch, err := UtilCheckEtag(etagHeader, fmt.Sprintf("books;%d;%d", book.Id, book.Rev))

	if err != nil {
		UtilSendResponseErrorInternal(w, err)
		return
	}

	if !isEtagMatch {
		UtilSendResponseClientPreconditionFailed(w)
		return
	}

	payload := bookRequestPayload{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		UtilSendResponseErrorInternal(w, err)
	}

	row = db.QueryRow(fmt.Sprintf("UPDATE books SET title='%s', description='%s', author='%s', rev='%d' WHERE id = %d RETURNING id, title, description, author, rev", payload.Title, payload.Description, payload.Author, (book.Rev + 1), book.Id))
	book = bookModel{}

	err = row.Scan(
		&book.Id,
		&book.Title,
		&book.Description,
		&book.Author,
		&book.Rev,
	)
	if err != nil {
		UtilSendResponseErrorInternal(w, err)
		return
	}

	etag, err := UtilHashString(fmt.Sprintf("books;%d;%d", book.Id, book.Rev))
	if err != nil {
		UtilSendResponseErrorInternal(w, err)
		return
	}

	w.Header().Set("ETag", etag)
	UtilSendResponse(w, http.StatusOK, UtilResponseData{
		UtilBaseResponse: UtilBaseResponse{
			Status:  true,
			Message: "Book updated",
		},
		Data: &book,
	})
}

func BookGetAll(w http.ResponseWriter, r *http.Request) {
	db := database.GetDb()

	results, err := db.Query("SELECT * FROM books")
	if err != nil {
		UtilSendResponseErrorInternal(w, err)
		return
	}

	books := []bookModel{}

	for results.Next() {
		book := bookModel{}

		err = results.Scan(
			&book.Id,
			&book.Title,
			&book.Description,
			&book.Author,
			&book.Rev,
		)
		if err != nil {
			UtilSendResponseErrorInternal(w, err)
			return
		}

		books = append(books, book)
	}

	UtilSendResponse(w, http.StatusOK, UtilResponseData{
		UtilBaseResponse: UtilBaseResponse{
			Status:  true,
			Message: "Success",
		},
		Data: &books,
	})
}

func BookDeleteById(w http.ResponseWriter, r *http.Request) {
	bookIdPath := r.PathValue("id")

	if len(bookIdPath) > 0 {
		db := database.GetDb()

		_, err := db.Exec("DELETE FROM books WHERE id = ?", bookIdPath)

		if err != nil {
			UtilSendResponseErrorInternal(w, err)
			return
		}
	}

	UtilSendResponse(w, http.StatusOK, UtilBaseResponse{
		Status:  true,
		Message: "Delete success",
	})
}
