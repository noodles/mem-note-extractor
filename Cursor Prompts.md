I want an app called "Mem Extract" that lets a user upload an markdown file and split it into separate markdown files.

The uploaded document use three dashes to delimit each of the markdown pages it contains. Once a document is uploaded, the app should split the document into separate pages and save them as individual markdown files. All of the markdown files should be put into a zip folder and downloaded as one file.

Below is an example of some markdown text in between the 3 equals signs

===

 ---
Notes for Physio 

- ask Chris about knee stuff

- show Matt video of surf club gym 
- workout plan including... 
-- Pilates, swimming, running, cycling

---
Patrol 4 - Saturday Nov 16 
6:30 - 11:45

Sam - blond moustache. FIFO. Postie bike. Doesn't surf much.
Wayne - hit chips, ex-patrol 10 PC. 26' trailer Sailor
Andrew - SAS lived in Perth. 
Trinity Cycles, South African & his sin
Faith - from Brisbane 
Dan - big guy with beard

---
Physio

1 leg box squats
Build up to 3 sets of 15

---
Baking Tray - 270 x 340

---
As Bokonon says, "Peculiar travel suggestions are dancing lessons from God."

Cat's Cradle - Kurt Vonnegut

===

Given this input the app should create 5 markdown files.
The file name should be the same as the first line in that page but no longer than 25 characters.

So using the example above...

Notes for Physio.md
Patrol 4 - Saturday Nov.d

