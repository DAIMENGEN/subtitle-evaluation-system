import "./audio-subtitle-viewer.scss";
import {Button} from "antd";
import React, {useCallback, useState} from "react";

export const AudioSubtitleViewer = () => {
    const [audioFiles, setAudioFiles] = useState<File[]>([]);
    const [chineseRatings, setChineseRatings] = useState<number[]>([]);
    const [englishRatings, setEnglishRatings] = useState<number[]>([]);
    const [japaneseRatings, setJapaneseRatings] = useState<number[]>([]);
    const [englishSubtitles, setEnglishSubtitles] = useState<string[]>([]);
    const [chineseSubtitles, setChineseSubtitles] = useState<string[]>([]);
    const [japaneseSubtitles, setJapaneseSubtitles] = useState<string[]>([]);

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
            setJapaneseRatings(new Array(sortedFiles.length).fill(0)); // Initialize ratings
        }
    };

    const handleRatingChange = useCallback((index: number, value: number, language: string) => {
        switch (language) {
            case "chinese": {
                const newRatings = [...chineseRatings];
                newRatings[index] = value;
                setChineseRatings(newRatings);
                break;
            }
            case "english": {
                const newRatings = [...englishRatings];
                newRatings[index] = value;
                setEnglishRatings(newRatings);
                break;
            }
            case "japanese": {
                const newRatings = [...japaneseRatings];
                newRatings[index] = value;
                setJapaneseRatings(newRatings);
                break;
            }
        }
    }, [chineseRatings, englishRatings, japaneseRatings]);

    const handleSaveRatings = useCallback(() => {
        // 确保三个语言的评分数组长度一致
        const maxLength = Math.max(chineseRatings.length, englishRatings.length, japaneseRatings.length);

        const content = Array.from({ length: maxLength }).map((_, index) => {
            // 获取每个语言的评分，缺失的评分用空字符串填充
            const chineseRating = chineseRatings[index] ?? '';
            const englishRating = englishRatings[index] ?? '';
            const japaneseRating = japaneseRatings[index] ?? '';
            // 用逗号连接三个语言的评分
            return `${chineseRating},${englishRating},${japaneseRating}`;
        }).join("\n");

        // 创建Blob并触发下载
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ratings.txt";
        link.click();
    }, [chineseRatings, englishRatings, japaneseRatings]);

    const handleLoadRatings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                const loadedRatings = content.split("\n");

                // 确保所有语言的评分数组长度一致
                const updatedChineseRatings: number[] = [];
                const updatedEnglishRatings: number[] = [];
                const updatedJapaneseRatings: number[] = [];

                for (let i = 0; i < loadedRatings.length; i++) {
                    const line = loadedRatings[i].split(","); // 分割每一行的评分

                    // 获取每个语言的评分，确保其存在
                    const chineseRating = parseInt(line[0] || "0");
                    const englishRating = parseInt(line[1] || "0");
                    const japaneseRating = parseInt(line[2] || "0");

                    // 更新每个语言的评分，确保在 0 到 10 之间
                    updatedChineseRatings[i] = Math.min(Math.max(chineseRating, 0), 10);
                    updatedEnglishRatings[i] = Math.min(Math.max(englishRating, 0), 10);
                    updatedJapaneseRatings[i] = Math.min(Math.max(japaneseRating, 0), 10);
                }

                // 设置状态
                setChineseRatings(updatedChineseRatings);
                setEnglishRatings(updatedEnglishRatings);
                setJapaneseRatings(updatedJapaneseRatings);
            };
            reader.readAsText(file);
        }
    }, []);

    const handleClearRatings = useCallback(() => {
        const fileInput = document.getElementById('loadRatings') as HTMLInputElement;
        setChineseRatings(ratings => ratings.map(() => 0));
        setEnglishRatings(ratings => ratings.map(() => 0));
        setJapaneseRatings(ratings => ratings.map(() => 0));
        fileInput.value = "";
    }, []);

    const getSubtitleColorClass = useCallback((rating: number) => {
        if (rating >= 8 && rating <= 10) {
            return "green-color"; // 绿色优秀
        } else if (rating >= 5 && rating < 8) {
            return "yellow-color"; // 可以接受（黄色）
        } else if (rating > 0 && rating < 5) {
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
                        <th>Chinese</th>
                        <th>ChineseRating</th>
                        <th>English</th>
                        <th>EnglishRating</th>
                        <th>Japanese</th>
                        <th>JapaneseRating</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({
                        length: Math.max(audioFiles.length, englishSubtitles.length, chineseSubtitles.length, japaneseSubtitles.length, japaneseRatings.length),
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
                            <td className={getSubtitleColorClass(chineseRatings[index] || 0)}>{chineseSubtitles[index] || "-"}</td>
                            <td>
                                <input
                                    type="number"
                                    value={chineseRatings[index] || 0}
                                    min={0}
                                    max={10}
                                    onChange={(e) => handleRatingChange(index, parseInt(e.target.value) || 0, "chinese")}
                                />
                            </td>
                            <td className={getSubtitleColorClass(englishRatings[index] || 0)}>{englishSubtitles[index] || "-"}</td>
                            <td>
                                <input
                                    type="number"
                                    value={englishRatings[index] || 0}
                                    min={0}
                                    max={10}
                                    onChange={(e) => handleRatingChange(index, parseInt(e.target.value) || 0, "english")}
                                />
                            </td>
                            <td className={getSubtitleColorClass(japaneseRatings[index] || 0)}>{japaneseSubtitles[index] || "-"}</td>
                            <td>
                                <input
                                    type="number"
                                    value={japaneseRatings[index] || 0}
                                    min={0}
                                    max={10}
                                    onChange={(e) => handleRatingChange(index, parseInt(e.target.value) || 0, "japanese")}
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
