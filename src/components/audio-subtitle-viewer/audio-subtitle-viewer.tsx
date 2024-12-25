import "./audio-subtitle-viewer.scss";
import React, {useCallback, useState} from "react";
import {Button} from "antd";

export const AudioSubtitleViewer = () => {
    const [englishSubtitles, setEnglishSubtitles] = useState<string[]>([]);
    const [chineseSubtitles, setChineseSubtitles] = useState<string[]>([]);
    const [japaneseSubtitles, setJapaneseSubtitles] = useState<string[]>([]);
    const [audioFiles, setAudioFiles] = useState<File[]>([]);
    const [ratings, setRatings] = useState<number[]>([]);

    const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                setter(content.split("\n"));
            };
            reader.readAsText(file);
        }
    };

    const handleAudioFolderLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const sortedFiles = Array.from(files).sort((a, b) => a.name.localeCompare(b.name)); // Sort by file name (date order assumed)
            setAudioFiles(sortedFiles);
            setRatings(new Array(sortedFiles.length).fill(0)); // Initialize ratings
        }
    };

    const handleRatingChange = (index: number, value: number) => {
        const newRatings = [...ratings];
        newRatings[index] = value;
        setRatings(newRatings);
    };

    const handleSaveRatings = () => {
        const content = ratings
            .map(rating => `${rating}`) // Save with line number
            .join("\n");
        const blob = new Blob([content], {type: "text/plain"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ratings.txt";
        link.click();
    };

    const handleLoadRatings = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                const loadedRatings = content.split("\n");
                // Ensure all lines are updated, including undefined parts
                const updatedRatings = new Array(
                    Math.max(englishSubtitles.length, chineseSubtitles.length, japaneseSubtitles.length, loadedRatings.length)
                ).fill(0);

                for (let i = 0; i < loadedRatings.length; i++) {
                    const rating = parseInt(loadedRatings[i] || "0");
                    updatedRatings[i] = Math.min(Math.max(rating, 0), 10);
                }
                setRatings(updatedRatings);
            };
            reader.readAsText(file);
        }
    };

    const handleClearRatings = useCallback(() => {
        const fileInput = document.getElementById('loadRatings') as HTMLInputElement;
        setRatings(ratings => ratings.map(() => 0));
        fileInput.value = "";
    }, []);


    const getSubtitleColorClass = useCallback((rating: number) => {
        if (rating >= 8 && rating <= 10) {
            return "green-color"; // 绿色优秀
        } else if (rating >= 5 && rating < 8) {
            return "yellow-color"; // 可以接受（黄色）
        } else if (rating > 0 && rating < 5 ) {
            return "red-color"; // 不可接受（红色）
        }
        return "black-color";
    }, []);

    return (
        <div className="app">
            <h1>Subtitle Viewer</h1>
            <div className="file-inputs">
                <div>
                    <label htmlFor="audio">Load Audio Files:</label>
                    <input type="file" id="audio" accept="audio/wav" multiple onChange={handleAudioFolderLoad}/>
                </div>
                <div>
                    <label htmlFor="loadRatings">Load Ratings:</label>
                    <input type="file" id="loadRatings" accept=".txt" onChange={handleLoadRatings}/>
                </div>
                <div>
                    <label htmlFor="english">Load English Subtitles:</label>
                    <input type="file" id="english" accept=".txt"
                           onChange={(e) => handleFileLoad(e, setEnglishSubtitles)}/>
                </div>
                <div>
                    <label htmlFor="chinese">Load Chinese Subtitles:</label>
                    <input type="file" id="chinese" accept=".txt"
                           onChange={(e) => handleFileLoad(e, setChineseSubtitles)}/>
                </div>
                <div>
                    <label htmlFor="japanese">Load Japanese Subtitles:</label>
                    <input type="file" id="japanese" accept=".txt"
                           onChange={(e) => handleFileLoad(e, setJapaneseSubtitles)}/>
                </div>
            </div>
            <div className="operate-buttons">
                <Button onClick={handleSaveRatings} style={{marginRight: "10px"}}>Save Ratings</Button>
                <Button onClick={handleClearRatings} style={{marginRight: "10px"}}>Clear Ratings</Button>
            </div>
            <div className="subtitle-table">
                <table>
                    <thead>
                    <tr>
                        <th>Line</th>
                        <th style={{minWidth: 200}}>Audio</th>
                        <th>English</th>
                        <th>Chinese</th>
                        <th>Japanese</th>
                        <th>Rating</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({
                        length: Math.max(audioFiles.length, englishSubtitles.length, chineseSubtitles.length, japaneseSubtitles.length, ratings.length),
                    }).map((_, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {audioFiles[index] ? (
                                    <audio controls>
                                        <source src={URL.createObjectURL(audioFiles[index])} type="audio/wav"/>
                                        Your browser does not support the audio element.
                                    </audio>
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td className={getSubtitleColorClass(ratings[index] || 0)}>{englishSubtitles[index] || "-"}</td>
                            <td className={getSubtitleColorClass(ratings[index] || 0)}>{chineseSubtitles[index] || "-"}</td>
                            <td className={getSubtitleColorClass(ratings[index] || 0)}>{japaneseSubtitles[index] || "-"}</td>
                            <td>
                                <input
                                    type="number"
                                    value={ratings[index] || 0}
                                    min={0}
                                    max={10}
                                    onChange={(e) => handleRatingChange(index, parseInt(e.target.value) || 0)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
