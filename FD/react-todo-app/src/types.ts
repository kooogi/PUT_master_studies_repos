export interface Todo {
  _id?: string;
  text: string;
  done: boolean;
  listId?: string;
}

export interface TodoList {
  _id: string;
  name: string;
  createdAt?: Date;
}

export interface DeleteListResponse {
  message: string;
  deletedList: TodoList;
}
