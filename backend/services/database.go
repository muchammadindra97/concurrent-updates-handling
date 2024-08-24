package database

import (
	"database/sql"
	"os"

	_ "modernc.org/sqlite"
)

var dbConnection *sql.DB

func InitDb() {
	_, err := os.OpenFile("./database.sqlite", os.O_RDONLY|os.O_CREATE, 0644)

	if err != nil {
		panic("Can't create database!")
	}

	db, err := sql.Open("sqlite", "./database.sqlite")
	if err != nil {
		panic("Can't open database!")
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS books(id INTEGER PRIMARY KEY, title TEXT, description TEXT, author TEXT, rev INTEGER)")
	if err != nil {
		panic("Fail to create database")
	}

	dbConnection = db
}

func GetDb() *sql.DB {
	if dbConnection == nil {
		InitDb()
	}

	return dbConnection
}
