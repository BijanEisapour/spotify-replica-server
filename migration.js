const https = require('https');
const fs = require('fs');

require('./server');
const {query} = require('./utils/controller-utils');

const SONGS_FOLDER_PATH = './public/files/songs/';
const COVERS_FOLDER_PATH = './public/files/covers/';

const MIN_PUBLISH_DATE = new Date(2019, 1, 1);
const MAX_PUBLISH_DATE = new Date(2021, 7, 28);

const res = {
    status: (code) => {
        console.log('code ', code);

        return {
            send: (message) => {
                console.log('message ', message);
            },
        };
    },
};

const randomDate = () => {
    const date = new Date(+MIN_PUBLISH_DATE + Math.random() * (MAX_PUBLISH_DATE - MIN_PUBLISH_DATE));
    return new Intl.DateTimeFormat('fr-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(date);
};

const importSongs = async () => {
    const songs = JSON.parse(fs.readFileSync('./songs.json'));

    const values = [];
    songs
        .filter((x) => x['Lyrics'])
        .forEach((x) =>
            values.push([x['Id'], x['Name'], x['Artist'], x['Lyrics'], x['Path'], x['CoverPath'], randomDate()])
        );

    await query(res, 'INSERT INTO song (id, name, artist, lyrics, file, cover, publish_date) VALUES ?', [values]);
};

const download = (url, file, finishCallback) => {
    https.get(url, (res) => {
        res.pipe(file);
        file.on('finish', finishCallback);
    });
};

const removeSong = async (id, songPath, coverPath) => {
    try {
        await query(res, 'DELETE FROM song WHERE id = ?', id);
        fs.access(songPath, () => fs.unlinkSync(songPath));
        fs.access(coverPath, () => fs.unlinkSync(coverPath));
    } catch {
        // ignored
    }
};

const downloadAndRelink = async () => {
    const songs = await query(res, 'SELECT * FROM song', []);

    console.log(`songs length = ${songs.length}`);

    for (const song of songs) {
        const songFileName = song.file.split('/').reverse()[0];
        const coverFileName = songFileName.slice(0, songFileName.length - 4) + '.jpg';
        const songPath = SONGS_FOLDER_PATH + songFileName;
        const coverPath = COVERS_FOLDER_PATH + coverFileName;

        try {
            const songFile = fs.createWriteStream(songPath);
            const coverFile = fs.createWriteStream(coverPath);

            download(song.file, songFile, () => {
                songFile.close();
                console.log(`downloaded song ${song.id}`);

                download(song.cover, coverFile, async () => {
                    coverFile.close();
                    console.log(`downloaded cover ${song.id}`);

                    await query(res, 'UPDATE song SET file = ?, cover = ? WHERE id = ?', [
                        songPath,
                        coverPath,
                        song.id,
                    ]);
                });
            });
        } catch {
            console.warn(`removed song ${song.id}`);
            await removeSong(song.id, songPath, coverPath);
        }
    }
};

const migrate = async () => {
    try {
        await query(res, 'DELETE FROM song WHERE TRUE');
        await query(res, 'ALTER TABLE song AUTO_INCREMENT = 1');

        console.log('importing songs ...');
        await importSongs();

        console.log('downloading songs ...');
        await downloadAndRelink();
    } catch (err) {
        console.log(err);
    }
};

migrate().then(() => {
    console.log('Done!');
});
