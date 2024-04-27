#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

// Define an array to store student records

const students: {
  id: number;
  name: string;
  courses: string[];
  balance: number;
  enrolled: boolean;
}[] = [];

// Function to add student

async function addStudent() {
  const newStudent = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Please enter the student's name:",
    },
  ]);

  const studentId = (students.length + 1).toString().padStart(5, "0");

  students.push({
    id: parseInt(studentId),
    name: newStudent.name,
    courses: [],
    balance: 0,
    enrolled: true,
  });

  console.log(`Student Added! ID: ${studentId}, Name: ${newStudent.name}`);
}

// Function to enroll student

async function registerStudent() {
  const enrollStudent = await inquirer.prompt([
    {
      name: "courseName",
      type: "list",
      message: "Please select the course you want to enroll:",
      choices: [
        "Web Development (HTML, CSS, JavaScript)",
        "Artificial Intelligence (basics)",
        "Computer Security",
        "Database Management Systems (SQL)",
        "Machine Learning Fundamentals",
        "Computer Security",
      ],
    },
    {
      name: "studentId",
      type: "input",
      message: "Enter the student ID to enroll:",
    },
  ]);

  const studentId = parseInt(enrollStudent.studentId);

  const foundStudent = students.find((s) => s.id === studentId);
  if (foundStudent) {
    foundStudent.courses.push(enrollStudent.courseName);
    console.log(`Enrolled ${foundStudent.name} in ${enrollStudent.courseName}`);
  } else {
    console.log("Student not found.");
  }
}

// Function to view student balance

async function studentBalance() {
  const viewBalance = await inquirer.prompt([
    {
      name: "studentId",
      type: "input",
      message: "Enter the student ID to view balance:",
    },
  ]);

  const studentId = parseInt(viewBalance.studentId);

  const findStudent = students.find((s) => s.id === studentId);
  if (findStudent) {
    console.log(
      `Account balance for student with ID ${studentId}: $${findStudent.balance.toFixed(
        0
      )}, Please top up your account.`
    );
  } else {
    console.log("Student not found.");
  }
}

// Function for topping up balance

async function topUpBalance() {
  const topUpAmountPrompt = await inquirer.prompt([
    {
      name: "topUpAmount",
      type: "input",
      message: "Please enter the amount for topping up balance:",
    },
  ]);

  const topUpAmount = parseFloat(topUpAmountPrompt.topUpAmount);
  const studentIdForTopUp = await inquirer.prompt([
    {
      name: "studentId",
      type: "input",
      message: "Enter the student ID for top-up:",
    },
  ]);

  const studentById = students.find(
    (s) => s.id === parseInt(studentIdForTopUp.studentId)
  );
  if (studentById) {
    studentById.balance += topUpAmount;
    console.log(
      `Balance topped up! New balance: $${studentById.balance.toFixed(0)}`
    );
  } else {
    console.log("Student not found. Please enter a valid student ID.");
  }
}

// Function the user to pay tuition fees

async function payFee() {
  const confirmPayment = await inquirer.prompt([
    {
      name: "confirmPayment",
      type: "confirm",
      message: "Would you like to pay tuition fees?",
    },
  ]);

  if (!confirmPayment) {
    console.log("Payment canceled.");
  } else {
    const PayTuitionFee = await inquirer.prompt([
      {
        name: "tuitionFee",
        type: "number",
        message: "Enter the tuition fee amount:",
        validate: (input) =>
          isNaN(input) || parseFloat(input) <= 0
            ? "Please enter a valid positive number."
            : true,
      },
      {
        name: "studentId",
        type: "input",
        message: "Enter the student ID for payment:",
      },
    ]);

    const studentDetails = students.find(
      (s) => s.id === parseInt(PayTuitionFee.studentId)
    );
    if (studentDetails) {
      if (studentDetails.balance >= PayTuitionFee.tuitionFee) {
        studentDetails.balance -= PayTuitionFee.tuitionFee;
        console.log(
          `Tuition fees paid for student with ID ${PayTuitionFee.studentId}. Amount paid: $${PayTuitionFee.tuitionFee}`
        );
      } else {
        console.log("Insufficient balance. Payment canceled.");
      }
    } else {
      console.log("Student not found. Please enter a valid student ID.");
    }
  }
}

// Function to view status

async function showStatus() {
  const viewStatus = await inquirer.prompt([
    {
      name: "studentId",
      type: "input",
      message: "Enter the student ID to view status:",
    },
  ]);

  const studentId = parseInt(viewStatus.studentId);

  const matchedStudent = students.find((s) => s.id === studentId);
  if (matchedStudent) {
    const enrollmentStatus = matchedStudent.enrolled
      ? "Enrolled"
      : "Not Enrolled";
    const courseNames = matchedStudent.courses.join(", ");

    console.log(`
      Name: ${matchedStudent.name}
      Student ID: ${viewStatus.studentId}
      Courses: ${courseNames} 
      Enrollment Status: ${enrollmentStatus}
      Balance: $${matchedStudent.balance.toFixed(0)}
    `);
  } else {
    console.log("Student not found.");
  }
}

async function main() {
  let condition = true;

  do {
    // Prompt the user to choose an option
    const choices = await inquirer.prompt([
      {
        type: "list",
        name: "option",
        message: chalk.bold.cyan(
          "Welcome to Eira23 Student Management System! What would you like to do:"
        ),
        choices: [
          "Add Student",
          "Enroll Student",
          "View Balance",
          "Top Up Balance",
          "Pay Tuition Fee",
          "View Status",
          "Exit",
        ],
      },
    ]);

    switch (choices.option) {
      case "Add Student":
        await addStudent();
        break;
      case "Enroll Student":
        await registerStudent();
        break;
      case "View Balance":
        await studentBalance();
        break;
      case "Top Up Balance":
        await topUpBalance();
        break;
      case "Pay Tuition Fee":
        await payFee();
        break;
      case "View Status":
        await showStatus();
        break;
      case "Exit":
        condition = false;
        break;
      default:
        console.log("Invalid Choice. Please try again.");
    }
  } while (condition);
}

// Call the main function to start the program

main();
