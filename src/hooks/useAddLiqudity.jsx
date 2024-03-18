import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios';

import { poolListApi } from '../utils/apiRoutes';


export default function useAddLiquidity(unisatWallet, tokenOne, tokenTwo, currentPool) {


  return [setTokenPair, currentPool, loading, error,]
}