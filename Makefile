DATA       = data
SCRIPT     = my_bombyx.py
PYTHON     = python3
WEB_SERVER = server.py

.PHONY: all run run_range web clean

all:
	@echo "Bombyx Population Model"
	@echo "Usage: make [run|run_range|web|clean]"

run:
	$(PYTHON) $(SCRIPT) 10 3.3 > $(DATA)

run_range:
	$(PYTHON) $(SCRIPT) 10 100 400 > $(DATA)

web:
	$(PYTHON) $(WEB_SERVER)

clean:
	rm -f *~ $(DATA)
