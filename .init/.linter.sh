#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-todo-list-manager-13093-13103/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

