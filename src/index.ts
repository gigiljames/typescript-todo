class Collection {
  lists: TaskList[] = [];
  constructor() {}

  addList(list: TaskList) {
    this.lists.push(list);
  }
}

class TaskList {
  public list: Task[] = [];
  constructor(public title: string) {}

  addTask(task: Task) {
    this.list.push(task);
  }
}

class Task {
  constructor(public task: string, public desc: string) {}
}

class PriorityTask extends Task {
  constructor(public priority: number, task: string, desc: string) {
    super(task, desc);
  }
}

class PriorityTaskList extends TaskList {
  public list: PriorityTask[] = [];
  constructor(title: string) {
    super(title);
  }

  addTask(task: PriorityTask) {
    this.list.push(task);
    this.sort();
  }

  sort() {
    this.list.sort((a, b) => a.priority - b.priority);
  }
}

// const collection: t[] = [];

type t = {
  title: string;
  list: { task: string; desc: string }[];
};

const collection = new Collection();
const taskList1 = new TaskList('Sample list 1');
taskList1.addTask(new Task('Go to school', 'Take the bus to school'));
taskList1.addTask(new Task('Go to college', 'Take the bus to college'));
const taskList2 = new PriorityTaskList('Sample priority list 1');
taskList2.addTask(
  new PriorityTask(34, 'Go to school', 'Take the bus to school'),
);
taskList2.addTask(
  new PriorityTask(23, 'Go to college', 'Take the bus to college'),
);
collection.addList(taskList1);
collection.addList(taskList2);

document.addEventListener('DOMContentLoaded', () => {
  refreshTasks();
  const newListButton = document.getElementById('new-list');
  const newPriorityListButton = document.getElementById('new-priority-list');
  let newPriorityButtonAdded = false;
  let savePriorityButtonAdded = false;

  newListButton?.addEventListener('click', newListHandler);
  newPriorityListButton?.addEventListener('click', () => {
    const form = document.getElementById('priority-form') as HTMLDivElement;
    form.style.display = 'flex';

    const closeButton = form.querySelector('.close-button');
    closeButton?.addEventListener('click', () => {
      form.style.display = 'none';
    });

    const newButton = form.querySelector('#new-priority-task');
    if (!newPriorityButtonAdded) {
      newButton?.addEventListener('click', () => {
        const list = form.querySelector('.list');
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
          <input type="number" class="priority" placeholder="Priority" />
          <input type="text" class="task" placeholder="Task" />
          <input type="text" class="desc" placeholder="Description" />
          <button class="remove-task">X</button>`;
        list?.appendChild(listItem);
        // Remove task button
        const removeButton = listItem.querySelector(
          '.remove-task',
        ) as HTMLButtonElement;
        removeButton?.addEventListener('click', () => {
          list?.removeChild(listItem);
        });
      });
      newPriorityButtonAdded = true;
    }

    const saveButton = form.querySelector('.save-button');
    if (!savePriorityButtonAdded) {
      saveButton?.addEventListener('click', () => {
        form.style.display = 'none';
        const title =
          form.querySelector<HTMLInputElement>('.title')?.value || '';
        const taskList = new PriorityTaskList(title);
        const list = form.querySelectorAll('.list-item');
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          console.log(item);
          const taskElement = item.querySelector('.task') as HTMLInputElement;
          const descElement = item.querySelector('.desc') as HTMLInputElement;
          const priority = item.querySelector('.priority') as HTMLInputElement;
          const task = new PriorityTask(
            Number(priority.value),
            taskElement.value,
            descElement.value,
          );
          taskList.addTask(task);
        }
        // console.log(taskList);
        collection.addList(taskList);
        refreshTasks();
      });
      savePriorityButtonAdded = true;
    }
  });
});

let newTaskButtonAdded = false;
let saveButtonAdded = false;
const newListHandler = () => {
  const form = document.getElementById('normal-form') as HTMLDivElement;
  form.style.display = 'flex';
  // Close button
  const closeButton = form.querySelector('.close-button');
  closeButton?.addEventListener('click', () => {
    form.style.display = 'none';
  });
  // New task button
  const newButton = form.querySelector('#new-task');
  if (!newTaskButtonAdded) {
    const addTaskHandler = () => {
      const list = form.querySelector('.list');
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.innerHTML = `
        <input type="text" class="task" placeholder="Task" />
        <input type="text" class="desc" placeholder="Description" />
        <button class="remove-task">X</button>`;
      list?.appendChild(listItem);
      // Remove task button
      const removeButton = listItem.querySelector(
        '.remove-task',
      ) as HTMLButtonElement;
      removeButton?.addEventListener('click', () => {
        list?.removeChild(listItem);
      });
    };
    newButton?.addEventListener('click', addTaskHandler);
    newTaskButtonAdded = true;
  }

  // Save button
  const saveButton = form.querySelector('.save-button');
  if (!saveButtonAdded) {
    saveButton?.addEventListener('click', () => {
      form.style.display = 'none';
      const title = form.querySelector<HTMLInputElement>('.title')?.value || '';
      const taskList = new TaskList(title);
      const list = form.querySelectorAll('.list-item');
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        console.log(item);
        const taskElement = item.querySelector('.task') as HTMLInputElement;
        const descElement = item.querySelector('.desc') as HTMLInputElement;
        const task = new Task(taskElement.value, descElement.value);
        taskList.addTask(task);
      }
      // console.log(taskList);
      collection.addList(taskList);
      refreshTasks();
    });
    saveButtonAdded = true;
  }
};

function refreshTasks() {
  let lists = collection.lists;
  let allList = document.querySelector('.list-display')!;
  allList.innerHTML = '';
  lists.forEach((list) => {
    const listCard = document.createElement('div');
    listCard.classList.add('list-card');
    const title = document.createElement('div');
    title.classList.add('card-title');
    title.innerHTML = list.title;
    listCard.appendChild(title);
    const taskList = document.createElement('div');
    taskList.classList.add('task-list');
    list.list.forEach((task) => {
      if (task instanceof PriorityTask) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('list-item');
        taskElement.innerHTML = `
        ${task.priority}
        ${task.task}
        ${task.desc} `;
        taskList.appendChild(taskElement);
      } else if (task instanceof Task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('list-item');
        taskElement.innerHTML = `
        ${task.task}
        ${task.desc} `;
        taskList.appendChild(taskElement);
      }
    });
    listCard.appendChild(taskList);
    allList?.appendChild(listCard);
  });
}
