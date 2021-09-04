package main

import (
	"bytes"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"
)

const (
	zettelkasten      = "../content/zettelkasten"
	backlinksTemplate = `

## Backlinks

{{ range . }}
- [{{ .Name }}]({{ .Path }}){{ end }}
`
)

var (
	backlinkExpression *regexp.Regexp
	titleExpression    *regexp.Regexp
	markdownTemplate   *template.Template
	backlinkTable      map[string][]string
)

type backlink struct {
	Name string
	Path string
}

func main() {
	backlinkTable = make(map[string][]string)

	backlinkExpression = regexp.MustCompile(`/zettelkasten/\S+\b`)
	titleExpression = regexp.MustCompile(`title: \S+`)

	markdownTemplate = template.Must(template.New("backlinks").Parse(backlinksTemplate))

	if err := filepath.Walk(zettelkasten, walker); err != nil {
		log.Fatal(err)
	}

	for filepath, links := range backlinkTable {
		f, err := os.OpenFile(path.Join("../content", fmt.Sprintf("%s.md", filepath)), os.O_APPEND|os.O_RDWR, 0644)
		if err != nil {
			log.Fatal(err)
		}
		defer f.Close()

		content, err := ioutil.ReadAll(f)
		if err != nil {
			log.Fatal(err)
		}

		// get the title
		title := titleExpression.FindString(string(content))

		// create the backlink structs
		backlinks := []backlink{}
		for _, link := range links {
			backlinks = append(backlinks, backlink{
				Name: strings.Split(title, "\"")[1],
				Path: link,
			})
		}

		buf := new(bytes.Buffer)
		if err := markdownTemplate.Execute(buf, backlinks); err != nil {
			log.Fatal(err)
		}

		if _, err := f.Write(buf.Bytes()); err != nil {
			log.Fatal(err)
		}

	}
}

// walker runs over the zettels and gathers information about links
func walker(path string, info fs.FileInfo, err error) error {
	if info.IsDir() {
		return nil
	}

	f, err := os.OpenFile(path, os.O_APPEND|os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	content, err := ioutil.ReadAll(f)
	if err != nil {
		return err
	}

	for _, link := range backlinkExpression.FindAllString(string(content), -1) {
		backlinkTable[link] = append(backlinkTable[link], strings.TrimSuffix(strings.TrimPrefix(path, "../content"), ".md"))
	}

	return nil
}
