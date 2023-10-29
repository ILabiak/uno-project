
"use client"
import './styles.css';

import React, { useState, useRef, createRef, useEffect } from 'react';
import io from 'socket.io-client';


export default function Play() {
    const [room, setRoom] = useState(null)

    useEffect(() => {
        const socketInstance = io.connect('http://localhost:8080/',);

        socketInstance.on('connect', async () => {
            console.log('Connected to the server');
            socketInstance.emit('getRooms')
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        socketInstance.on('sendRooms', async (data) => {
            setRoom(data)
        });
    }, [])

    return (
        <main
            className='main'
            style={{
                backgroundImage: `url(game-background1.jpeg)`,
                backgroundSize: 'cover',
            }}
        >
            <div className='roomsContainer'>
                <span className='roomsTitle'>{room ? 'Available rooms' : 'No available rooms'}</span>
                {room ? (

                    <ul className='roomsList'>
                        <li className='roomElement'>
                            <div className='roomInfo'>
                                <div className='roomName'>Room: {room.name}</div>
                                <div className='roomPlayers'>Players: {room.players}/2</div>
                            </div>
                            <a className='roomButton' href={'/play/' + room.name}>Join</a>
                        </li>
                    </ul>
                ) : (
                    <a className='createRoomButton' href={'/play/' + Math.floor(Math.random() * 100)}>Create room</a>
                )}

            </div>
        </main>
    );
}
