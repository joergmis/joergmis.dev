.PHONY: tailwind
tailwind: ## Generate CSS for the frontend.
	@echo "+ $@"
	@cd ./tailwind && \
		npx tailwindcss -c tailwind.config.js -i raw.css -o ../static/style.css

.PHONY: npm-install
npm-install: ## Install the npm packages.
	@echo "+ $@"
	@cd ./tailwind && \
		npm install && \
		npm update


