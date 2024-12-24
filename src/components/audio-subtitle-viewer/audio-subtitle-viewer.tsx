import "./audio-subtitle-viewer.scss";
import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {Flex, Upload} from "antd";
import {InboxOutlined} from "@ant-design/icons";

export const AudioSubtitleViewer = () => {

    const {Dragger} = Upload;
    const [audioFiles, setAudioFiles] = useState<File[]>([]);

    const [chineseSubtitleFile, setChineseSubtitleFile] = useState<File>();
    const [englishSubtitleFile, setEnglishSubtitleFile] = useState<File>();
    const [japaneseSubtitleFile, setJapaneseSubtitleFile] = useState<File>();

    const [englishSubtitles, setEnglishSubtitles] = useState<string[]>([]);
    const [chineseSubtitles, setChineseSubtitles] = useState<string[]>([]);
    const [japaneseSubtitles, setJapaneseSubtitles] = useState<string[]>([]);

    const setSubtitles = useCallback((file: File, setter: Dispatch<SetStateAction<string[]>>) => {
        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result as string;
            setter(content.split("\n"));
        };
        reader.readAsText(file);
    }, []);

    return (
        <div className={"subtitle-audio-viewer"}>
            <div className={"subtitle-audio-viewer-header"}>
                <div style={{width: "100%", textAlign: "center"}}>
                    <h1>Audio Subtitle Viewer</h1>
                </div>
                <Flex vertical={false} gap={20} className="file-inputs">
                    <div>
                        <label htmlFor="audio">Audio Files:</label>
                        <Dragger multiple accept={"audio/wav"} showUploadList={true} onChange={(e) => {
                            const files = e.fileList.map((file) => file.originFileObj as File);
                            setAudioFiles(Array.from(files).sort((a, b) => a.name.localeCompare(b.name)));
                        }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag audio wav file to this area to upload</p>
                            <div className={"update-file-container"}>
                                <ul>
                                    {audioFiles.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </Dragger>
                    </div>
                    <div>
                        <label htmlFor="chinese">Chinese Subtitle File:</label>
                        <Dragger accept={".txt"} showUploadList={false} onChange={(e) => {
                            const file = e.file.originFileObj as File;
                            setChineseSubtitleFile(file);
                            setSubtitles(file, setChineseSubtitles);
                        }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag chinese subtitles to this area to upload</p>
                            <div className={"update-file-container"}>
                                <ul>
                                    <li key={0}>{chineseSubtitleFile?.name}</li>
                                </ul>
                            </div>
                        </Dragger>
                    </div>
                    <div>
                        <label htmlFor="english">English Subtitle File:</label>
                        <Dragger multiple accept={".txt"} showUploadList={false} onChange={(e) => {
                            const file = e.file.originFileObj as File;
                            setEnglishSubtitleFile(file);
                            setSubtitles(file, setEnglishSubtitles);
                        }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag english subtitles to this area to upload</p>
                            <div className={"update-file-container"}>
                                <ul>
                                    <li key={0}>{englishSubtitleFile?.name}</li>
                                </ul>
                            </div>
                        </Dragger>
                    </div>
                    <div>
                        <label htmlFor="japanese">Japanese Subtitle File:</label>
                        <Dragger multiple accept={".txt"} showUploadList={false} onChange={(e) => {
                            const file = e.file.originFileObj as File;
                            setJapaneseSubtitleFile(file);
                            setSubtitles(file, setJapaneseSubtitles);
                        }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag japanese subtitles to this area to upload</p>
                            <div className={"update-file-container"}>
                                <ul>
                                    <li key={0}>{japaneseSubtitleFile?.name}</li>
                                </ul>
                            </div>
                        </Dragger>
                    </div>
                </Flex>
            </div>
            <div className={"subtitle-audio-viewer-content"}>
                <table>
                    <thead>
                    <tr>
                        <th>Line</th>
                        <th>Audio</th>
                        <th>Chinese</th>
                        <th>English</th>
                        <th>Japanese</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({
                        length: Math.max(englishSubtitles.length, chineseSubtitles.length, japaneseSubtitles.length),
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
                            <td>{chineseSubtitles[index] || "-"}</td>
                            <td>{englishSubtitles[index] || "-"}</td>
                            <td>{japaneseSubtitles[index] || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}