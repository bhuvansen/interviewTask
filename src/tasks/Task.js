import React from "react"
import Table from "react-bootstrap/Table"
import { dummyEmpDetails } from "./sampleValue"
import Button from "react-bootstrap/Button"
import "./task.css"

class Task extends React.Component {
  constructor() {
    super()
    this.state = {
      empDetails: [],
      editMode: false,
      lowestSalary:false,
      highestSalary:false
    }
  }
  componentDidMount() {
    this.setState({ empDetails: dummyEmpDetails })
  }
  edit(key) {
    let empArray = [...this.state.empDetails]
    empArray[key-1].editMode = true
    this.setState({ editMode: true, empDetails: empArray })
  }
  handleChange(event, type, key) {
    let empArray = [...this.state.empDetails]
    empArray[key][type] = event.target.value
    this.setState({ empDetails: empArray })
  }
  update(key){
    let empArray = [...this.state.empDetails]
    empArray[key-1].editMode = false
    this.setState({ empDetails: empArray})
  }
  delete(key){
    let empArray = [...this.state.empDetails].filter((item)=>item.id!==key)
    this.setState({empDetails:empArray})
  }
  loadTable(dept){
    if(dept!=="all"){
     this.setState({empDetails:dummyEmpDetails.filter(item=>item.employee_dept===dept)})
    }else{
        this.setState({empDetails:dummyEmpDetails}) 
    }
    }
    loadSalary(SalaryType){
        if(SalaryType==="lowest"){
            this.setState({lowestSalary : true})
        }else{
            this.setState({highestSalary : true})
        }
    }
  render() {
    const { empDetails, highestSalary, lowestSalary } = this.state
    let salaryArray=[]
    salaryArray = dummyEmpDetails.map((item)=> {return item.employee_salary})
    return (
      <div>
      <div className="action mb-2 mt-2">
      <Button variant="danger" onClick={this.loadTable.bind(this, "Backend")}>Load Backend Department List</Button>
    <Button variant="danger" onClick={this.loadTable.bind(this, "Frontend")}>Load Frontend Department List</Button>
    <Button variant="danger" onClick={this.loadTable.bind(this, "all")}>Load All Department List</Button>
    </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Emplyee Name</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {empDetails.map((item) => {
              return (
                <tr key={item.id}>
                <td> {!item.editMode ? (
                    item.employee_name
                  ) : (
                    <input
                      type="text"
                      value={item.employee_name}
                      onChange={(e) => this.handleChange(e, "employee_name", item.id - 1)}
                    />
                  )}</td>
                  <td>{!item.editMode ? (
                    item.employee_dept
                  ) : (
                    <input
                      type="text"
                      value={item.employee_dept}
                      onChange={(e) => this.handleChange(e, "employee_dept", item.id - 1)}
                    />
                  )}</td>
                  <td>Rs. {!item.editMode ? (
                   item.employee_salary
                  ) : (
                    <input
                      type="text"
                      value={item.employee_salary}
                      onChange={(e) => this.handleChange(e, "employee_salary", item.id - 1)}
                    />
                  )}</td>
                  <td>
                  <div className="action">
                   {!item.editMode && (
                      <Button variant="outline-secondary" onClick={this.edit.bind(this, item.id)}>
                        Edit
                      </Button>
                    )}
                    {item.editMode && (
                      <><Button variant="outline-secondary" onClick={this.update.bind(this, item.id)}>
                        Update
                      </Button>
                      </>
                    )}
                    <Button variant="outline-danger" onClick={this.delete.bind(this, item.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <div className="filter">
            <Button variant="success" onClick={this.loadSalary.bind(this, "lowest")} className="mb-2">Lowest Paid Salary</Button>
            {lowestSalary && <span className="mb-2">{Math.min(...salaryArray)}</span>}
            <Button variant="success" onClick={this.loadSalary.bind(this, "highest")} className="mb-2">Highest Paid Salary</Button>
            {highestSalary && <span>{Math.max(...salaryArray)}</span>}
        </div>
      </div>
    )
  }
}

export default Task
