import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoomComponent } from "./room/room.component";

const routes: Routes = [
  {
    path: "room/:roomId",
    component: RoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
