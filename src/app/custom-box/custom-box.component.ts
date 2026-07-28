import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TerminalInputComponent } from "../terminal-input/terminal-input.component";

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  expanded?: boolean;
}

@Component({
  selector: "app-custom-box",
  standalone: true,
  imports: [CommonModule, TerminalInputComponent],
  templateUrl: "./custom-box.component.html",
  styleUrls: ["./custom-box.component.css"],
})
export class CustomBoxComponent {
  experiences: Experience[] = [
    {
      title: "Full-Stack Developer",
      company: "StradaGlobal",
      location: "Miami, FL",
      period: "July 2024 – Present",
      bullets: [
        "Engineered high-throughput data conversion pipelines for Workday, successfully migrating 10M+ records for major enterprise clients and supporting hundreds of internal conversion specialists as part of a 5-engineer Professional Services team.",
        "Built RESTful APIs with Java/Spring Boot and data access layers using Spring JDBC/JPA, connecting frontend tools to Microsoft SQL Server on Azure for large-scale data conversion operations.",
        "Designed and implemented user interfaces with Angular, TypeScript, HTML, CSS, Bootstrap 5, and jQuery.",
        "Engineered an orchestrated UI automation pipeline with Python/Selenium that navigates Workday's front-end to execute tasks outside of Workday's native automation capabilities.",
        "Maintained and extended an in-house Angular/TypeScript data conversion tool backed by Spring Boot, executing SQL scripts against large datasets to validate Workday infrastructure integrations.",
        "Owned end-to-end development of a standalone, client-facing application that transforms employee HR data into Workday-compatible database schemas, productizing the core conversion engine from our main platform.",
        "Designed microservice architectures and scalable infrastructure patterns to support high-throughput data conversion pipelines serving hundreds of daily users.",
      ],
    },
    {
      title: "Full-Stack Web Developer",
      company: "Alight Solutions",
      location: "Miami, FL",
      period: "October 2021 – June 2024",
      bullets: [
        "Advanced form creation to streamline gathering user feedback and analytic information from the customer.",
        "Developed RESTful APIs for our in-house data management and conversion tool, enabling full CRUD functionality. Automated processes through scheduled jobs and integrated conditions based on leadership directives and developer-focused research.",
        "Built a desktop application (Node.js/Electron) for database developers that queues and executes SQL scripts across multiple client MSSQL databases with error handling and execution tracking.",
        "Created APIs that integrated Microsoft SQL Server procedures to quickly and efficiently clean and fix customer data.",
      ],
    },
  ];

  toggleExperience(exp: Experience): void {
    exp.expanded = !exp.expanded;
  }
}
