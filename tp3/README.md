# SGI 2023/2024 - TP3

## Group T03G02
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Gustavo Costa         | 202004187 | up202004187@edu.fe.up.pt |
| João Oliveira         | 202004407 | up202004407@edu.fe.up.pt |

## Run the program:

- Use Vscode liveshare extension.

## Game Logic:

- Use of a state machine with different states for each step of the game.

    - Menu States = {Main\_Menu & Name\_Menu & Game\_Settings\_Menu}

    - Car choice States = {Choose\_Own\_Car & Choose\_Opponent\_Car}
    
    - Playing State = {Playing}
    
    - Obstacle States = {Choose\_Obstacle & Place\_Obstacle}
    
    - Pause State = {Paused}
    
    - Finish Game State = {Game\_END}

## Instructions:

## Main Menu:

- The interaction with the button is done via picking, clicking on "Play" will lead to the next menu.

## Name Menu:

- Type your name using the keyboard and press enter to proceed to the next menu.

## Game Settings:

- The interaction with the button is done via picking, clicking on "Start" will lead to the next menu.

## Choose Cars:

- The interaction with the cars is done via picking, clicking on any car will select it and lead to the next state.

## Playing:

- The controls to move the car are "W", "A", "S", "D". "Space" to break & "ESC" to
go to the pause menu. The race will only start when you press "W".

## Pause:
- Pressing "ESC" will lead you back to the playing state.

## Finished Game:
- Pressing "R" will restart the game.

## Powerup:

- There’s just one powerup object, however the effect that will give is random. It
can either increase the max velocity, remove collisions & remove the off road
constraint. (10 seconds)


## Obstacles:

- There’s four different obstacles if you count the opponent's car. (5 seconds)


    - **Reverse Controls** - Reverts all the controls;

    - **Banana** - Decrease Max Speed;

    - **Oil** - Disables the car braking system.

    - **Opponent Car** - Decrease Max Speed;

## HUD:

- We have a HUD that displays the current velocity, the elapsed time since the
beginning of the race, the current state of the game and also the buffs and
debuffs and their remaining time of both the powerups & obstacles.
