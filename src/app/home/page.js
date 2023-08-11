"use client"
import interact from 'interactjs'
import { useEffect, useState, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

import { db } from './libs/firebase';
import './css/App.css';

import "tailwindcss/tailwind.css"

import Circle from './components/circle';
import DetailTab from './components/detail_tab';
import Sidebar from './components/sidebar';



function getDistanceAndAngle(theta1, phi1, theta2, phi2) {
  var R = 1; // 地球の半径（キロメートル）
  var dTheta = theta2 - theta1;
  var dPhi = phi2 - phi1;
  var a =
    Math.sin(dTheta / 2) * Math.sin(dTheta / 2) +
    Math.cos(theta1) * Math.cos(theta2) *
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var r = R * c; // 距離（キロメートル）

  // 地球上で(theta1, phi1)を中心とした半径rの円を考えたときの、(theta2, phi2)の角度（北極へ向かう線を0度として時計回り）
  var y = Math.sin(dPhi) * Math.cos(theta2);
  var x = Math.cos(theta1) * Math.sin(theta2) -
    Math.sin(theta1) * Math.cos(theta2) * Math.cos(dPhi);
  var rad = Math.atan2(y, x);

  return {
    r: r,    // 距離（キロメートル）
    rad: rad // 角度（ラジアン）
  };
}
function getDistanceAndAngleOnMercator(theta1, phi1, theta2, phi2) {
  // メルカトル図法における緯度の変換
  var y1 = Math.log(Math.tan(Math.PI / 4 + Math.PI / 4 - theta1 / 2));
  var y2 = Math.log(Math.tan(Math.PI / 4 + Math.PI / 4 - theta2 / 2));

  // x座標の差とy座標の差を計算
  var dx = phi2 - phi1;
  var dy = y2 - y1;

  // 距離の計算
  var r = Math.sqrt(dx * dx + dy * dy);

  // 角度の計算（北極へ向かう線を0ラジアンとして時計回り）
  var rad = Math.atan2(dx, dy);

  return {
    r: r,    // メルカトル図法上の距離
    rad: rad // メルカトル図法上の角度（ラジアン）
  };
}


export default function Home() {
  const [Vtubers, setVtubers] = useState([{}])
  const [detailingIndex, setDetailingIndex] = useState(undefined)


  //データのロード
  useEffect(() => {
    const from_firebase = true
    if (from_firebase) {
      const lst = []
      getDocs(collection(db, "vtubers")).then((querySnapshot) => {
        console.log("data loaded")
        querySnapshot.forEach((doc) => {
          const dic = doc.data()
          dic["id"] = doc.id
          dic["r"] = dic["polar_cord"][0]
          dic["theta"] = dic["polar_cord"][1]
          dic["phi"] = dic["polar_cord"][2]
          lst.push(dic)
        });
        setVtubers(lst)

      }).catch((error) => {
        console.log("Error getting documents: ", error);
        window.alert("Firebaseとの接続に失敗しました")
      });
    } else {
      const lst = static_lst
      console.log(lst)
      for (let i = 0; i < lst.length; i++) {
        dic["r"] = dic["polar_cord"][0]
        dic["theta"] = dic["polar_cord"][1]
        dic["phi"] = dic["polar_cord"][2]
      }
      setVtubers(lst);
    }

  }, [])

  //キャラクタークリック時の処理
  const onCircleClick = (index) => {
    setDetailingIndex(index)

    setCenterCoord({
      theta: Vtubers[index].theta,
      phi: Vtubers[index].phi,
    })
  }





  const [thetaWidth, setThetaWidth] = useState(Math.PI / 3)//X軸方向のtheta幅
  const [phiWidth, setPhiWidth] = useState(Math.PI / 3)//Y軸方向のphi幅
  const [centerCoord, setCenterCoord] = useState({
    theta: Math.PI / 2,
    phi: 0,
  })//中心の座標 theta,phi

  const vw = window.innerWidth
  const vh = window.innerHeight

  const isMouseTouching = useRef(false)
  const touchStartInfo = useRef()


  useEffect(() => {
    const mousedownfunc = (e) => {
      isMouseTouching.current = true
      touchStartInfo.current = {
        x: e.x,
        y: e.y,
        centerCoord: {
          theta: centerCoord.theta,
          phi: centerCoord.phi,
        }
      }
    }
    const mousemovefunc = (e) => {
      if (!isMouseTouching.current) {
        return
      }
      const tmp=(e.y - touchStartInfo.current.y) / vh * thetaWidth
      let theta = touchStartInfo.current.centerCoord.theta - (2*Math.atan(Math.exp(tmp))-Math.PI/2)*1.1
      let phi = touchStartInfo.current.centerCoord.phi - (e.x - touchStartInfo.current.x) / vw * phiWidth*1.1

      if (theta < Math.PI ) {
        theta = theta + Math.PI
      }
      if (theta > Math.PI) {
        theta = theta - Math.PI 
      }
      if (phi < -Math.PI) {
        phi = phi + Math.PI * 2
      }
      if (phi > Math.PI) {
        phi = phi - Math.PI * 2
      }

      setCenterCoord({
        theta: theta,
        phi: phi,
      })
    }
    const mouseupfunc = (e) => {
      isMouseTouching.current = false
    }



    document.addEventListener("mousedown", mousedownfunc)
    document.addEventListener("mousemove", mousemovefunc)
    document.addEventListener("mouseup", mouseupfunc)
    return () => {
      document.removeEventListener("mousedown", mousedownfunc)
      document.removeEventListener("mousemove", mousemovefunc)
      document.removeEventListener("mouseup", mouseupfunc)
    }

  }, [centerCoord])

  return (
    <div className="App">

      <div
      >

        {
          Vtubers.map((vt, index) => {
            const theta_phase = [0, Math.PI, -Math.PI]
            const phi_phase = [0, 2*Math.PI, -2*Math.PI]
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                const theta = vt.theta + theta_phase[i]
                const phi = vt.phi + phi_phase[j]
                const res = getDistanceAndAngleOnMercator(centerCoord.theta, centerCoord.phi, theta, phi)
                if (res.r < Math.max(thetaWidth, phiWidth) / Math.sqrt(2)) {
                  return (
                    <Circle
                      key={index}
                      index={index}
                      data={vt}
                      traX={res.r * Math.sin(res.rad) / thetaWidth * vw}
                      traY={-res.r * Math.cos(res.rad) / phiWidth * vh}
                      onCircleClick={onCircleClick}
                    />
                  )
                }
              }
            }
          })
        }
      </div>
      <Sidebar></Sidebar>
      <DetailTab
        data={detailingIndex == undefined ? undefined : Vtubers[detailingIndex]}
      />
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* <img className="title-image" src={title}></img> */}
    </div>
  );
}

