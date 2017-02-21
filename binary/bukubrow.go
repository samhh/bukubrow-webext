package main

import (
	"database/sql"
	"log"
	"os"
	_ "github.com/mattn/go-sqlite3"
)

// Bookmark represents a single row from database
type Bookmark struct {
	Id       int
	Url      string
	Metadata string
	Tags     string
	Desc     string
	Flags    int
}

func main() {
	dbpath := GetDbPath()

	db := InitDB(dbpath)
	defer db.Close()

	bookmarks := GetAllBookmarks(db)
	log.Print(bookmarks)
}

// Write errors to log & quit
func CheckError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func InitDB(filepath string) *sql.DB {
	db, err := sql.Open("sqlite3", filepath)
	CheckError(err)
	if db == nil {
		panic("db nil")
	}
	return db
}

func GetAllBookmarks(db *sql.DB) []Bookmark {
	const queryAll string = "SELECT * FROM bookmarks;"

	rows, err := db.Query(queryAll)
	CheckError(err)
	defer rows.Close()

	var result []Bookmark
	for rows.Next() {
		item := Bookmark{}
		err2 := rows.Scan(&item.Id, &item.Url, &item.Metadata, &item.Tags, &item.Desc, &item.Flags)
		CheckError(err2)
		result = append(result, item)
	}

	return result
}

func GetDbPath() string {
	const dbFileName string = "bookmarks.db"

	var dir = os.Getenv("XDG_DATA_HOME")
	if dir != "" {
		dir += "/buku/"
	} else {
		dir = os.Getenv("HOME") + "/.local/share/buku/"
	}

	dir += dbFileName

	return dir
}
