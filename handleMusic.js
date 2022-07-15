const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playList = $('.playlist')
const cd = $('.cd')
const songName = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPlayPause = $('.btn-toggle-play')
const player = $('.player')
const progressBar = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

/** TASK
 * 1. Render song
 * 2. Scroll song
 * 3. Play/pause/seek => optimate
 * 4. next/pre/next/repeat/random
 * 5. cdthub animation
 * 6. play song in playList
 * 7. focus into playList
 * 8. store the setting
 */

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,


    songs: [
        {
            name: "You Belong With Me",
            singer: "Taylor Swift",
            path: "./assets/music/you-belong-with-me.mp3",
            image: './assets/img/taylor.jpg'
        },
        {
            name: "Roar",
            singer: "Katy Perry",
            path: "./assets/music/roar.mp3",
            image: "./assets/img/roar.jpg"
        },
        {
            name: "Payphone",
            singer: "Maroon 5",
            path: "./assets/music/payphone.mp3",
            image: "./assets/img/payphone.jpg"
        },
        {
            name: "Call Me Maybe",
            singer: "Carly Rae Jepsen",
            path: "./assets/music/callmemaybe.mp3",
            image: "./assets/img/callmemybaby.jpg"
        },
        {
            name: "Solo",
            singer: "Jennie",
            path: "./assets/music/solo.mp3",
            image: "./assets/img/solo.png"
        },
        {
            name: "Girls Like You",
            singer: "Raftaar x Harjas",
            path: "./assets/music/girlslikeyou.mp3",
            image: "./assets/img/girlslikeyou.jpg"
        },
        {
            name: "Blank Space",
            singer: "Taylor Swift",
            path: "./assets/music/blankspace.mp3",
            image: "./assets/img/blankspace.jpg"
        }],


    render: function () {
        var renderHtml = this.songs.map(function (song, index) {
            return `
            <div class="song" data-index=${index} }>
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>`
        })
        playList.innerHTML = renderHtml.join('')
    },

    defaultProperties: function () {
        Object.defineProperty(this, 'currentsong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleUserEvent: function () {
        // phải đặt bên ngoài bởi vì giá trị này sẽ không đổi khi mà scroll

        var _this = this
        var cdWidth = cd.offsetWidth
        var handleScroll
        var currentWidth
        var allSong =  $$('.song')

        getSong = function(songElement){
            if(songElement.matches('.song')){
                return songElement
            }else{
                while (songElement.parentElement){
                    if(songElement.matches('.song')){
                        return songElement
                    }
                    songElement = songElement.parentElement
                }
            }
        }

        resetActiveSong = function(){
            Array.from(allSong).forEach(function(song){
                if(song.matches('.song.active')){
                    song.classList.remove('active')
                }
            })
        }

        playList.onclick = function (e) {
            resetActiveSong()
            if(!e.target.matches('.playlist')){
                var songElement = getSong(e.target)
                if(songElement){
                    songElement.classList.add('active')
                    _this.playSong(songElement.getAttribute('data-index'))
                    audio.volume = 0.3
                    audio.play()
                }
            }
        }

        document.onscroll = function () {
            // nếu đặt bên trong mỗi lần scroll giá trị sẽ bị thay đổi => function lỗi
            handleScroll = window.scrollY || document.documentElement.scrollTop
            currentWidth = cdWidth - handleScroll
            cd.style.width = currentWidth > 0 ? currentWidth + 'px' : 0
            cd.style.opacity = currentWidth / cdWidth
        }

        cbAnimation = cd.animate([{
            transform: "rotate(360deg)"
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cbAnimation.pause()


        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', isRepeat)
        }

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }


        btnPlayPause.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
                cbAnimation.pause()
            }
            else {
                audio.play()
                cbAnimation.play()
                audio.volume = 0.5
            }
        }

        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
        }

        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
        }

        audio.ontimeupdate = function () {
            if (audio.duration) {
                progressBar.value = Math.floor(audio.currentTime / audio.duration * 100)
                // (audio.currentTime * 100 / audio.duration)
            }
        }

        window.onkeyup = function (e) {
            switch (e.which) {
                case 77:
                    if (audio.volume != 0) {
                        audio.volume = 0
                    } else {
                        audio.volume = 1
                    }
                    break
                case 188:
                    if (audio.volume > 0) {
                        audio.volume = audio.volume - .1
                    }
                    break
                case 190:
                    if (audio.volume < 1) {
                        audio.volume = audio.volume + .1
                    }
                    break
                default:
            }
        }

        progressBar.oninput = function (e) {
            audio.currentTime = (progressBar.value * audio.duration) / 100
        }

        nextBtn.onclick = function () {
            if (!_this.isRandom) {
                _this.nextSong()
            } else {
                _this.randomSong()
            }
            audio.play()
            cbAnimation.play()
            _this.scrollIntoActiveSong()
        }

        prevBtn.onclick = function () {
            if (!_this.isRandom) {
                _this.prevSong()
            } else {
                _this.randomSong()
            }
            audio.play()
            cbAnimation.play()
        }

    },

    /**
     * Xử lý
     */
    scrollIntoActiveSong(){
        console.log($('.song.active'));
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end", 
                inline: "nearest"
            })
        }, 500);
    },

    playSong(index){
        this.currentIndex = index
        this.loadSong()
    },

    nextSong() {
        this.currentIndex++
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadSong()
    },

    randomSong: function () {
        do {
            var randomIndex = Math.floor(Math.random() * this.songs.length)
        } while (this.currentIndex === randomIndex)
        this.currentIndex = randomIndex
        this.loadSong()
    },


    loadSong: function () {
        songName.innerText = this.currentsong.name;
        audio.src = this.currentsong.path
        cdThumb.style.background = `url(${this.currentsong.image}) center / contain`;
    },


    start: function () {
        this.defaultProperties()
        this.render()
        this.loadSong()
        this.handleUserEvent()
        
    }
}


app.start();