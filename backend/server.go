package main

import (
	"fmt"
	"library-sample-be/database"
	"library-sample-be/handler"
	"net/http"
)

func main() {
	database.InitDb()

	http.HandleFunc("/book", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			handler.BookCreate(w, r)
			return
		} else if r.Method == "GET" {
			handler.BookGetAll(w, r)
			return
		}

		handler.UtilSendResponseErrorNotFound(w)
	})
	http.HandleFunc("/book/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handler.BookGetById(w, r)
			return
		} else if r.Method == "PUT" {
			handler.BookUpdateById(w, r)
			return
		} else if r.Method == "DELETE" {
			handler.BookDeleteById(w, r)
			return
		}

		handler.UtilSendResponseErrorNotFound(w)
	})

	var address = "localhost:9000"
	fmt.Printf("server started at %s\n", address)
	err := http.ListenAndServe(address, nil)
	if err != nil {
		panic(err.Error())
	}
}
