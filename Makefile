#!/usr/bin/env bash -c make

SRC=./timestamp.js
TESTS=*.json ./test/*.js
TARGET=./docs
JSDEST=./docs/timestamp.min.js
JSGZIP=./docs/timestamp.min.js.gz

DOCS_DIR=./docs/jsdoc
DOC_HTML=./docs/jsdoc/Timestamp.html
DOCS_CSS_SRC=./assets/jsdoc.css
DOCS_CSS_DEST=./docs/jsdoc/styles/jsdoc-default.css

all: test $(TARGET) $(JSGZIP)

clean:
	rm -fr $(JSDEST)

$(TARGET):
	mkdir -p $(TARGET)

$(JSDEST): $(SRC)
	./node_modules/.bin/uglifyjs $(SRC) -c -m -o $(JSDEST)

$(JSGZIP): $(JSDEST)
	gzip -9 < $(JSDEST) > $(JSGZIP)
	ls -l $(JSDEST) $(JSGZIP)

test:
	@if [ "x$(BROWSER)" = "x" ]; then make test-node; else make test-browser; fi

test-node: jshint mocha

test-browser:
	./node_modules/.bin/zuul -- $(TESTS)

test-browser-local:
	node -e 'process.exit(process.platform === "darwin" ? 0 : 1)' && sleep 1 && open http://localhost:4000/__zuul &
	./node_modules/.bin/zuul --local 4000 -- $(TESTS)

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint .

jsdoc: $(DOC_HTML)

$(DOC_HTML): README.md $(SRC) $(DOCS_CSS_SRC)
	mkdir -p $(DOCS_DIR)
	./node_modules/.bin/jsdoc -d $(DOCS_DIR) -R README.md $(SRC)
	cat $(DOCS_CSS_SRC) >> $(DOCS_CSS_DEST)
	rm -f $(DOCS_DIR)/*.js.html
	for f in $(DOCS_DIR)/*.html; do sed 's#</a> on .* 201.* GMT.*##' < $$f > $$f~ && mv $$f~ $$f; done
	for f in $(DOCS_DIR)/*.html; do sed 's#<a href=".*.js.html">.*line.*line.*</a>##' < $$f > $$f~ && mv $$f~ $$f; done

.PHONY: all clean test jshint mocha
