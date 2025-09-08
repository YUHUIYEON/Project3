/* wrap */ 
//LocomotiveScroll의 가상 스크롤 값을 ScrollTrigger에 연결해서, 두 라이브러리가 같은 기준으로 스크롤과 애니메이션을 동기화하도록 설정하는 함수
function loco(){
    gsap.registerPlugin(ScrollTrigger); //플러그인을 GSAP에 등록.
    // 모바일 역스크롤 겹침/점프 완화 (데스크톱 영향 없음)
    if (window.innerWidth <= 768) {
        ScrollTrigger.config({ ignoreMobileResize: true });
        if (ScrollTrigger.normalizeScroll) {
            ScrollTrigger.normalizeScroll(true);
        }
    }

    const locoScroll = new LocomotiveScroll({   //LocomotiveScroll 초기화
        el: document.querySelector("#wrap"), //스크롤 영역은 #wrap
        smooth: true    //부드러운 스크롤 효과 적용
    });
    
    locoScroll.on("scroll", ScrollTrigger.update);  //LocomotiveScroll이 스크롤될 때마다 ScrollTrigger도 업데이트 되도록 연결

    ScrollTrigger.scrollerProxy("#wrap", {  //ScrollTrigger가 LocomotiveScroll을 “대체 스크롤러”처럼 인식하게 하는 API.
    scrollTop(value) {  //값이 있으면 scrollTo() 실행 → 특정 위치로 강제 스크롤 이동
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, 
    getBoundingClientRect() {   //뷰포트 크기 반환(항상 윈도우 전체 기준)
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    pinType: getComputedStyle(document.querySelector("#wrap")).transform !== "none" ? "transform" : "fixed" //요소 고정 방식 지정
});
window.__locoScroll = locoScroll;
ScrollTrigger.addEventListener("refresh", () => locoScroll.update()); //ScrollTrigger가 리프레시(레이아웃 새로 계산) 할 때 LocomotiveScroll도 업데이트 → 두 라이브러리의 상태를 항상 동기화
ScrollTrigger.refresh();    //초기 위치와 핀 설정 등을 한 번 계산해줌
}
loco()

// 모바일에서만 초기 로드/리사이즈/회전 시 동기화 강화
if (window.innerWidth <= 768) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            if (window.__locoScroll) window.__locoScroll.update();
            ScrollTrigger.refresh(true);
        }, 60);
    });
    window.addEventListener("resize", () => {
        if (window.__locoScroll) window.__locoScroll.update();
        ScrollTrigger.refresh(true);
    });
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            if (window.__locoScroll) window.__locoScroll.update();
            ScrollTrigger.refresh(true);
        }, 120);
    });
}

// nav
// ScrollTrigger.create({
//     trigger: "#wrap",
//     scroller: "#wrap",
//     start: "top top",
//     end: "bottom bottom",
//     pin: "nav",
//     pinSpacing: false
// });


// page1
function pg1(){
    const tl = gsap.timeline({
        scrollTrigger:{
            trigger:"#page1",
            scroller:"#wrap",
            start:"top top",
            end:"+=130%",
            scrub:1,
            pin:true
        }
    });
    tl.fromTo("#page1 .bg",
        {opacity:0.2},         // 시작값
        {opacity:1, ease:"none"}  // 끝값 
    );
}
pg1();
// scroll down 깜빡깜빡
(function(){
    const el = document.querySelector("#page1 .sd");
    if(!el) return;

    ScrollTrigger.create({
        trigger:"#page1",
        scroller:"#wrap",
        start:"top+=1 top", 
        end:"bottom top",
        onEnter:()=>{
            el.classList.add("stop-blink");
            gsap.to(el,{opacity:0,duration:.8,overwrite:true});
        },
        onLeaveBack:()=>{
            el.classList.remove("stop-blink");
            gsap.to(el,{opacity:1,duration:.3,overwrite:true});
        }
    });
})();


// page2 video
function pg2(){
    const video = document.querySelector("#page2 video");
    if(!video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const tween = gsap.to(video, { width: "100%", ease: "none" });
    ScrollTrigger.create({
        animation: tween,
        trigger: "#page2",
        scroller: "#wrap",
        start: "top 75%",
        end: "top 0%",
        scrub: true,
        markers: false
    });

    ScrollTrigger.create({
        trigger: "#page2",
        scroller: "#wrap",
        start: "top 80%",    
        end: "bottom top+=200",
        onEnter: () => { if (video.paused) video.play(); },
        onEnterBack: () => { if (video.paused) video.play(); },
        onUpdate: self => { if (self.isActive && video.paused) video.play(); },
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause()
    });
}
pg2();


// page3
function pg3(){
    var tl = gsap.timeline({
        scrollTrigger:{
            trigger:"#page3",
            scroller:"#wrap",
            start:"top 70%",
            end:"top 55%",
            scrub:2
        }
    });
    tl.from(".page3-text #line1",{ width:"0%" },"a")
        .from(".page3-text #line2",{ height:"0%" },"a");

    gsap.from("#page3 #line",{
        height:"0%",
        scrollTrigger:{
            trigger:"#page3",
            scroller:"#wrap",
            start:"top 10%",
            end:"top -10%",
            scrub:2
        }
    });
    gsap.from("#page3 .page3T1", {
        y: 80,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#page3 .page3T1",
            scroller: "#wrap",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
    gsap.from("#page3 .page3T2", {
        y: 80,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#page3 .page3T2",
            scroller: "#wrap",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
}
pg3();
// page3 시계
const deg = 6;
const hr = document.getElementById("hr");
const mn = document.getElementById("mn");
const sc = document.getElementById("sc");

setInterval(() => {
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * deg;
    let ss = day.getSeconds() * deg;

    hr.style.transform = `rotateZ(${(hh)+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;
},1000)
// page3 배경
function pg3Video(){
    const video = document.querySelector("#page3 .page3-bg");
    if(!video) return;

    video.playbackRate = 0.7; // 1보다 작으면 느리게, 1보다 크면 빠르게
}
pg3Video();





// page4 vertical
function initVerticalScroll(section, items) {
    items.forEach((item, index) => {
        gsap.set(item, { 
        yPercent: index === 0 ? 0 : 100, 
        y: index * 70,
        width: `${90 + index * 3}%` 
        });
    });

    const timeline = gsap.timeline({
        scrollTrigger: {
        trigger: section,
        scroller: "#wrap",
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
        },
        defaults: { ease: "none" },
    });

    items.forEach((item, index) => {
        timeline.to(item, { scale: 0.97 });
        if (index + 1 < items.length) {
        timeline.to(items[index + 1], { yPercent: 0, y: index * 20 + 20 }, "<+=0.5"); //카드 올라오는 간격
        }
    });
    }

    document.querySelectorAll("#page4").forEach(section => {
    const items = section.querySelectorAll(".list .item");
    initVerticalScroll(section, items);
});


// page5
function pg5(){
    var tl6 = gsap.timeline({
        scrollTrigger:{
            trigger:"#page5",
            scroller:"#wrap", 
            // markers:true,
            start:"top 65%",
            end:"top 40%",
            scrub:2,
        }
    })
    tl6
    .from("#line5-vt",{
        height:"0"
    },"h")
    .from("#line5",{
        width:"0"
    },"h")
    .from("#line5-h",{
        width:"0",
    },"h")      
}
pg5()


// page8
// page8
function pg8(){
    const mm = gsap.matchMedia();

    gsap.set(["#ig1","#ig2","#ig3","#ig4","#ig5"], {
        xPercent:-50, yPercent:-50, top:"50%", left:"50%", opacity:0
    });

    // 모바일
    mm.add("(max-width: 768px)", () => {
        const tl = gsap.timeline({
            scrollTrigger:{
                trigger:"#page8",
                scroller:"#wrap",
                start:"top 90%",
                end:"top -10%",
                scrub:7
            }
        });

        //출발
        tl.set(["#ig1","#ig2","#ig3","#ig4","#ig5"], {opacity:1}, 0)

        //현재 상태 → 지정한 상태로 애니메이션 (모바일)
        .to("#ig1", {x:-120, y:-30,  opacity:1, ease:"power2.out"}, 0.05)   // 가까운 러닝 코스 추천해줘
        .to("#ig2", {x: 100, y:-60, opacity:1, ease:"power2.out"}, 0.07)   // 주변 스파게티 맛집 찾아줘
        .to("#ig3", {x: 90,  y:60,  opacity:1, ease:"power2.out"}, 0.09)   // 내일 오전 6시 알람 맞춰줘
        .to("#ig4", {x:-100, y:70,  opacity:1, ease:"power2.out"}, 0.11)   // 방문 온 문자에 답장 ‘알겠어요
        .to("#ig5", {x:   0, y:-70, opacity:1, ease:"power2.out"}, 0.13);  // 이번주 상영중인 영화 추천해줘
    });

    // PC
    mm.add("(min-width: 769px)", () => {
        const tl = gsap.timeline({
            scrollTrigger:{
                trigger:"#page8",
                scroller:"#wrap",
                start:"top 90%",
                end:"top -10%",
                scrub:7
            }
        });

        //출발
        tl.from(["#ig1","#ig2","#ig3","#ig4","#ig5"], {
            x:0, y:0, scale:0, opacity:0,
            transformOrigin:"50% 50%",
            ease:"power2.out",
            stagger:0,
            immediateRender:false
        }, 0)
        
        //현재 상태 → 지정한 상태로 애니메이션 (PC)
        .to("#ig1", {x:-530, y:-10, opacity:1, ease:"power2.out"}, 0.05)  // 가까운 러닝 코스 추천해줘
        .to("#ig2", {x: 420, y:-120, opacity:1, ease:"power2.out"}, 0.07)  // 주변 스파게티 맛집 찾아줘
        .to("#ig3", {x: 350, y: 200, opacity:1, ease:"power2.out"}, 0.09)  // 내일 오전 6시 알람 맞춰줘
        .to("#ig4", {x:-320, y: 300, opacity:1, ease:"power2.out"}, 0.11)  // 방문 온 문자에 답장 ‘알겠어요
        .to("#ig5", {x:   0, y:-250, opacity:1, ease:"power2.out"}, 0.13); // 이번주 상영중인 영화 추천해줘
    });
}
pg8();


// page9
var over = document.querySelectorAll("#page9 .over")

over.forEach(function(ov){
    gsap.to(ov,{
        width:"0%",
        scrollTrigger:{
            trigger:ov,
            scroller:"#wrap",
            // markers:true,
            start:"top 45%",
            end:"top -20%",
            scrub:true
        }
    })
})
// page9 - item1
gsap.to("#ig94", {
    rotation: 360,
    ease: "none",
    scrollTrigger: {
        trigger: "#page9",
        scroller: "#wrap",
        start: "top bottom",  
        end: "bottom top", 
        scrub: true
    }
});
// page9 - box
gsap.to("#box-1", {
    x: -400,
    rotate: -850,
    backgroundColor: "#4d4dff",
    borderRadius: "0%",
    scrollTrigger: {
        trigger: "#page9",
        scroller: "#wrap",
        start: "top 20%",
        end: "bottom top",
        scrub: true
    }
});



// page11 cursor
function cursorFunc() {
    const cursorBall = document.querySelector('#page11 .cursor-ball');
    const page11 = document.getElementById("page11");
    if (!cursorBall || !page11) return;

    let pos = { x: 0, y: 0 };
    let mouse = { x: 0, y: 0 };
    const speed = 0.25; // 값이 작을수록 천천히, 클수록 빠르게 따라옴

    // quickSetter로 transform x,y 제어
    const xSet = gsap.quickSetter(cursorBall, "x", "px");
    const ySet = gsap.quickSetter(cursorBall, "y", "px");

    // page11 안에서만 좌표 추적
    page11.addEventListener("mousemove", (e) => {
        const rect = page11.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        cursorBall.style.opacity = 1; // 마우스 들어오면 보이기
    });

    page11.addEventListener("mouseleave", () => {
        cursorBall.style.opacity = 0; // 빠져나가면 숨김
    });

    // GSAP ticker로 부드럽게
    gsap.ticker.add(() => {
        pos.x += (mouse.x - pos.x) * speed;
        pos.y += (mouse.y - pos.y) * speed;
        xSet(pos.x);
        ySet(pos.y);
    });
}
cursorFunc();
// page11 모바일
(function(){
    const cards = Array.from(document.querySelectorAll('#page11 [id^="ii"]'));
    if(!cards.length) return;

    const onTap = (e)=>{
        const card = e.currentTarget;
        const open = card.classList.contains('show-text');
        cards.forEach(c=>c.classList.remove('show-text'));
        if(!open) card.classList.add('show-text');
    };

    cards.forEach(card=>{
        card.addEventListener('pointerup', onTap, {passive:true});
    });
})();


// page12 horizontal
function initPage12(section, items) {
    items.forEach((item, index) => {
        gsap.set(item, { 
        xPercent: index === 0 ? 0 : 100, 
        x: index * 120,   
        height: `${85 + index * 5}%` 
        });
    });

    const timeline = gsap.timeline({
        scrollTrigger: {
        trigger: section,
        scroller: "#wrap",
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
        },
        defaults: { ease: "none" },
    });

    items.forEach((item, index) => {
        timeline.to(item, { scale: 0.97 });
        if (index + 1 < items.length) {
        timeline.to(items[index + 1], { xPercent: 0, x: index * 20 + 20 }, "<+=0.5");
        }
    });
    }

    document.querySelectorAll("#page12").forEach(section => {
    const items = section.querySelectorAll(".list .item");
    initPage12(section, items);
});


// pahe14
var tl14 = gsap.timeline({
    scrollTrigger:{
        trigger:"#page14",
        scroller:"#wrap",
        // markers:true,
        start:"top 30%",
        end:"top 10%",
        scrub:2,
    }
})
tl14
.from("#line14-v",{
    height:"0"
},"h")
.from("#line14",{
    width:"0"
},"h")


// page15
gsap.utils.toArray("#page15 .img-group img").forEach((el) => {
    gsap.to(el, {
        y: (i, target) => -500 * parseFloat(target.dataset.speed || 1),
        ease: "none",
        scrollTrigger: {
        trigger: "#page15",
        scroller: "#wrap",
        scrub: 0.5
        }
    });
});


// footer
if(window.innerWidth > 768){   // PC 전용
    var tll = gsap.timeline({
        scrollTrigger:{
            trigger:"#footer",
            scroller:"#wrap",
            start:"top 80%",
            end:"top 60%",
            scrub:2,
        }
    })
    tll.from("#fl",{ height:"0" },"h")

    var clutter =""
    document.querySelector("#footer h2").textContent.split("").forEach(function(letter){
        clutter += `<span>${letter}</span>`
    })
    document.querySelector("#footer h2").innerHTML = clutter

    var tle = gsap.timeline({
        scrollTrigger:{
            trigger:"#foot",
            scroller:"#wrap",
            start:"top 60%",
            end:"top 40%",
            scrub:2,
        }
    })
    tle.from("#foot h2 span",{ y:"-100%", stagger:-0.2 })
}
(function(){
    const h2 = document.querySelector('#footer h2');
    if(!h2) return;
    if(window.innerWidth <= 768 && h2.querySelector('span')){
        h2.textContent = h2.textContent; // 분할(span) 제거
    }
})();
