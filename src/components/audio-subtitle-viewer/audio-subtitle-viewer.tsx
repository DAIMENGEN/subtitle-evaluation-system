import "./audio-subtitle-viewer.scss";
import React, {useState} from "react";

export const AudioSubtitleViewer = () => {
    const [englishSubtitles, setEnglishSubtitles] = useState<string[]>([]);
    const [chineseSubtitles, setChineseSubtitles] = useState<string[]>([]);
    const [japaneseSubtitles, setJapaneseSubtitles] = useState<string[]>([]);
    const [audioFiles, setAudioFiles] = useState<File[]>([]);

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
        }
    };

    return (
        <div className="app">
            <h1>Subtitle Viewer</h1>
            <div className="file-inputs">
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
                <div>
                    <label htmlFor="audio">Load Audio Files:</label>
                    <input type="file" id="audio" accept="audio/wav" multiple onChange={handleAudioFolderLoad}/>
                </div>
            </div>
            <div className="subtitle-table">
                <table>
                    <thead>
                    <tr>
                        <th>Line</th>
                        <th>Audio</th>
                        <th>English</th>
                        <th>Chinese</th>
                        <th>Japanese</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({
                        length: Math.max(englishSubtitles.length, chineseSubtitles.length, japaneseSubtitles.length, audioFiles.length),
                    }).map((_, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{minWidth: 300}}>
                                {audioFiles[index] ? (
                                    <audio controls>
                                        <source src={URL.createObjectURL(audioFiles[index])} type="audio/wav"/>
                                        Your browser does not support the audio element.
                                    </audio>
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td>{englishSubtitles[index] || "-"}</td>
                            <td>{chineseSubtitles[index] || "-"}</td>
                            <td>{japaneseSubtitles[index] || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}