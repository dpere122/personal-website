import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SIZE, BOXTYPE } from "../app.component";
import { TextWallComponent } from "../message-box/text-wall.component";

@Component({
  selector: "app-blog-feed",
  templateUrl: "./blog-feed.component.html",
  styleUrls: ["./blog-feed.component.css"],
  standalone: true,
  imports: [CommonModule, TextWallComponent],
})
export class BlogFeedComponent {
  SizeEnum = SIZE;
  BOXTYPE = BOXTYPE;
}
