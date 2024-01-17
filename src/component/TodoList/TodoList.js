import React, { Component } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { FaTrashAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TodoList.css';

export default class ToApp extends Component {
  constructor(props) {
    super(props);
    const storedItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const storedCheckedItems = JSON.parse(localStorage.getItem('checkedItems')) || [];

    this.state = {
      input: '',
      items: storedItems,
      editingIndex: -1,
      checkedItems: storedCheckedItems,
    };
  }

  handleChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  storeItems = (event) => {
    event.preventDefault();
    const { input, items, editingIndex, checkedItems } = this.state;

    if (editingIndex !== -1) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = input;
      const updatedCheckedItems = [...checkedItems];
      this.setState(
        {
          items: updatedItems,
          editingIndex: -1,
        },
        () => {
          localStorage.setItem('todoItems', JSON.stringify(updatedItems));
        }
      );
    } else {
      this.setState(
        (prevState) => ({
          items: [...prevState.items, input],
          checkedItems: [...prevState.checkedItems, false],
           input: '', // Clear the input after adding a new task
        }),
        () => {
          localStorage.setItem('todoItems', JSON.stringify(this.state.items));
          localStorage.setItem('checkedItems', JSON.stringify(this.state.checkedItems));
        }
      );
    }
  };

  deleteItem = (index) => {
    const { items, checkedItems } = this.state;
    const updatedItems = [...items];
    const updatedCheckedItems = [...checkedItems];
    updatedItems.splice(index, 1);
    updatedCheckedItems.splice(index, 1);
    this.setState(
      {
        items: updatedItems,
        checkedItems: updatedCheckedItems,
      },
      () => {
        localStorage.setItem('todoItems', JSON.stringify(updatedItems));
        localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
      }
    );
  };

  editItem = (index) => {
    const { items } = this.state;
    const itemToEdit = items[index];
    this.setState({
      input: itemToEdit,
      editingIndex: index,
    });
  };

  handleCheckboxChange = (index) => {
    const { checkedItems } = this.state;
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    
    this.setState(
      {
        checkedItems: updatedCheckedItems,
        input: '', // Clear the input after adding a new task
        
      },
      () => {
        localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
      }
    );
  };

  render() {
    const { input, items, checkedItems } = this.state;

    return (
      <Container className="todo-container">
        <Form onSubmit={this.storeItems} className="input-section">
          <h1>Todo App</h1>
          <Form.Control
            type="text"
            placeholder="Enter items"
            onChange={this.handleChange}
            value={input}
          />
          <Button type="submit" variant="light" className="mt-2 btn-outline-dark">
            {this.state.editingIndex !== -1 ? 'Edit Item' : 'Add Item'}
          </Button>
        </Form>
        <ListGroup>
          {items.map((item, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  className="me-2"
                  checked={checkedItems[index]}
                  onChange={() => this.handleCheckboxChange(index)}
                />
                {checkedItems[index] ? (
                  <FaCheck className="text-success me-2" />
                ) : (
                  <FaTimes className="text-danger me-2" />
                )}
                {item}
              </div>
              <div className="d-flex">
                <FaTrashAlt
                  className="mr-4 me-2 text-dark"
                  onClick={() => this.deleteItem(index)}
                />
                <FaEdit
                  className="ml-4 text-dark"
                  onClick={() => this.editItem(index)}
                />
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    );
  }
}
