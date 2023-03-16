#Script para capturar inputs e salvar num .txt
# BPM
# Cada linha um input
# codBotao duração
import time
import keyboard 
import sys
import os

#Start measuring time
time_start = 0
time_click = 0
arquivo_inputs = open('tarantella_inputs.txt', 'w')
sair = False

def onKeyboardEvent(event):
    global time_start
    global time_click
    global arquivo_inputs
    global sair
    input_read = event.name
    print(input_read)
    if(time_start == 0):
        #Start measuring time
        time_start = time.time()
    
    if(input_read != 'c'):
        #Write the button code on the .txt
        if (input_read == 'q'):
            input_read = 39
        elif (input_read == 'w'):
            input_read = 37
        elif (input_read == 'o'):
            input_read = 38
        elif (input_read == 'p'):
            input_read = 40
        arquivo_inputs.write(str(input_read)+" ")
    else:  
        arquivo_inputs.close()
        sair = True 

    time_click = time.time()

    length = int(1000*(time_click - time_start))
    #timestep = int((1000*60/bpm)/8)
    #length_beats = int(length/timestep)

    #Write the length to the .txt and break line
    arquivo_inputs.write(str(length)+"\n")

       

    

print("Insira o BPM da musica: ")
bpm = int(input())
#Write the BPM to the first line of the .txt
arquivo_inputs.write(str(bpm)+"\n")

print("Comece a ouvir a música e apertar os botões Q W O P")
keyboard.on_press(onKeyboardEvent)


while not sair:
    pass


