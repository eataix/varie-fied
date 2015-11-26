package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/fatih/color"
)

func main() {
	username := os.Getenv("LOGIN")
	password := os.Getenv("PASSWORD")
	request, _ := http.NewRequest("GET", "https://v2.freeaddr.info", nil)
	request.SetBasicAuth(username, password)
	for {
		t := time.Now()
		go func() {
			resp, err := http.DefaultClient.Do(request)
			if err != nil {
				log.Fatal(err)
			}
			const layout = "2006-01-02 15:04:05"
			fmt.Print(t.Format(layout))
			if resp.StatusCode != http.StatusOK {
				color.Set(color.FgRed)
			} else {
				color.Set(color.FgGreen)
			}
			fmt.Printf("\t%s\n", resp.Status)
			color.Unset()
		}()
		if t.Hour() >= 7 && t.Hour() <= 16 {
			time.Sleep(10 * time.Second)
		} else {
			time.Sleep(10 * time.Minute)
		}
	}
}
