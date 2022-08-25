import React from "react"
import Table from "react-bootstrap/Table"
import { dummyEmpDetails } from "./sampleValue"
import Button from "react-bootstrap/Button"
import "./task.css"
import * as _ from "lodash"

class Task extends React.Component {
  constructor() {
    super()
    this.state = {
      empDetails: [],
      editMode: false,
      lowestSalary: false,
      highestSalary: false,
      addNew: false,
      newDept:"",
      newName:"",
      newSalary:"",
      newId:"",
      empDetailsFilter:[],
      filterMode:false,
      filteredDepartment:""
    }
  }

  componentDidMount() {
    this.setState({ empDetails: _.cloneDeep(dummyEmpDetails) })
    this.setState({ empdummyEmpDetailsBackup:  _.cloneDeep(dummyEmpDetails) })
  }

  edit(key) {
    let empArray = [...this.state.empDetails]
    empArray[key - 1].editMode = true
    this.setState({ editMode: true, empDetails: empArray })
  }

  handleChange(event, type, key) {
    let empArray = [...this.state.empDetails]
    empArray[key][type] = event.target.value
    this.setState({ empDetails: empArray })
  }

  update(key) {
    let empArray = [...this.state.empDetails]
    empArray[key - 1].editMode = false
    this.setState({ empDetails: empArray })
    this.setState({ empdummyEmpDetailsBackup: _.cloneDeep(empArray) })
  }


  delete(key) {
    let empArray = [...this.state.empDetails].filter((item) => item.id !== key)
    for(let i in empArray){
      empArray[i].id = empArray[i].id-1
    }
    this.setState({ empDetails: empArray , empdummyEmpDetailsBackup:_.cloneDeep(empArray) })
    if(this.state.filterMode){
      this.setState({ empDetailsFilter: empArray.filter((item) => item.employee_dept === this.state.filteredDepartment)})
    }
  }

  loadTable(dept) {
    this.setState({filteredDepartment:dept})
    if (dept !== "all") {
      this.setState({ empDetailsFilter: this.state.empDetails.filter((item) => item.employee_dept === dept) , filterMode: true})
    } else {
      this.setState({ empDetailsFilter: this.state.empDetails, filerMode:false })
    }
  }

  loadSalary(SalaryType) {
    if (SalaryType === "lowest") {
      this.setState({ lowestSalary: true })
    } else {
      this.setState({ highestSalary: true })
    }
  }

  addNewDetail() {
    this.setState({ addNew: true })
  }

  add(){
    let newEmp = {
      id: this.state.newId,
      employee_name: this.state.newName,
      employee_salary: this.state.newSalary,
      employee_dept: this.state.newDept,
      editMode:false
    }
    this.setState({addNew:false, empDetails:[...this.state.empDetails, newEmp], empdummyEmpDetailsBackup:_.cloneDeep([...this.state.empdummyEmpDetailsBackup, newEmp]), newDept:"", newEmp:"", newName:"", newSalary:"", newId:""})
    if(this.state.filterMode){
      this.setState({empDetailsFilter:[...this.state.empDetailsFilter, newEmp]})
    }
  }

  handleNewEmp(event, detailType, key){ 
    if(detailType==="name"){
      this.setState({newName: event.target.value})
    }else if(detailType==="dept"){
      this.setState({newDept: event.target.value})
    }else{
      this.setState({newSalary: event.target.value})
    }
    this.setState({newId: key+1})
  }

  cancelNew(){
    this.setState({ addNew: false,  newDept:"", newEmp:"", newName:"", newSalary:"", newId:""})
  }

  cancel(){
    this.setState({empDetails: _.cloneDeep(this.state.empdummyEmpDetailsBackup) })
    if(this.state.filterMode){
      this.setState({empDetailsFilter:_.cloneDeep(this.state.empdummyEmpDetailsBackup).filter((item)=>item.employee_dept===this.state.filteredDepartment)})
    }
  }

  render() {
    const { empDetails, highestSalary, lowestSalary, addNew, filterMode , empDetailsFilter} = this.state
    let tableDetail = filterMode? empDetailsFilter : empDetails
    let salaryArray = []
    salaryArray = tableDetail.map((item) => {
      return item.employee_salary
    })

    return (
      <div>
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
            {tableDetail.map((item) => {
              return (
                <tr key={item.id}>
                  <td>
                    {" "}
                    {!item.editMode ? (
                      item.employee_name
                    ) : (
                      <input
                        type="text"
                        value={item.employee_name}
                        onChange={(e) => this.handleChange(e, "employee_name", item.id - 1)}
                      />
                    )}
                  </td>
                  <td>
                    {!item.editMode ? (
                      item.employee_dept
                    ) : (
                      <input
                        type="text"
                        value={item.employee_dept}
                        onChange={(e) => this.handleChange(e, "employee_dept", item.id - 1)}
                      />
                    )}
                  </td>
                  <td>
                    Rs.{" "}
                    {!item.editMode ? (
                      item.employee_salary
                    ) : (
                      <input
                        type="text"
                        value={item.employee_salary}
                        onChange={(e) => this.handleChange(e, "employee_salary", item.id - 1)}
                      />
                    )}
                  </td>
                  <td>
                    <div className="action">
                      {!item.editMode && (
                        <Button variant="outline-secondary" onClick={this.edit.bind(this, item.id)}>
                          Edit
                        </Button>
                      )}
                      {item.editMode && (
                        <>
                          <Button variant="outline-secondary" onClick={this.update.bind(this, item.id)}>
                            Update
                          </Button>
                          <Button variant="outline-secondary" onClick={this.cancel.bind(this)}>
                            Cancel
                          </Button>
                        </>
                      )}
                      <Button variant="outline-danger" onClick={this.delete.bind(this, item.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {addNew && (
            <tr>
              <td>
                <input type="text" value={this.state.newName} onChange={(e) => this.handleNewEmp(e,"name", this.state.empDetails.length)} />
              </td>
              <td>
                <input type="text" value={this.state.newDept} onChange={(e) => this.handleNewEmp(e,"dept", this.state.empDetails.length)} />
              </td>
              <td>Rs. {" "}
                <input type="text" value={this.state.newSalary} onChange={(e) => this.handleNewEmp(e,"salary", this.state.empDetails.length)} />
              </td>
              <td>
                <div className="action">
                  <Button variant="outline-danger" onClick={this.add.bind(this)}>
                    Add
                  </Button>
                  <Button variant="outline-danger" onClick={this.cancelNew.bind(this)}>
                    Cancel
                  </Button>
                </div>
              </td>
            </tr>
            )}
          </tbody>
        </Table>
        <div className="action mb-2 mt-2">
          <Button variant="danger" onClick={this.loadTable.bind(this, "Backend")}>
            Load Backend Department List
          </Button>
          <Button variant="danger" onClick={this.loadTable.bind(this, "Frontend")}>
            Load Frontend Department List
          </Button>
          <Button variant="danger" onClick={this.loadTable.bind(this, "all")}>
            Load All Department List
          </Button>
          <Button variant="danger" onClick={this.addNewDetail.bind(this)} disabled={this.state.addNew}>
            Add New Detail
          </Button>
        </div>
        <div className="filter">
          <Button variant="success" onClick={this.loadSalary.bind(this, "lowest")} className="mb-2">
            Lowest Paid Salary
          </Button>
          {lowestSalary && <span className="mb-2">{salaryArray.length>0 ? Math.min(...salaryArray) : "No salary found"}</span>}
          <Button variant="success" onClick={this.loadSalary.bind(this, "highest")} className="mb-2">
            Highest Paid Salary
          </Button>
          {highestSalary && <span>{salaryArray.length>0 ? Math.max(...salaryArray) : "No salary found"}</span>}
        </div>
      </div>
    )
  }
}

export default Task
